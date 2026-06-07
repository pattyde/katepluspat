"""
Fix image caption formatting in post bodies.

Problem pattern:
    ![](./images/foo.jpg)

    Some caption text

Should become:
    ![Some caption text](./images/foo.jpg)

    *Some caption text*

Also updates the matching front matter caption: field if it was empty.
"""

import os, re, sys

posts_dir = '/Users/patrick/code/travel-blog/src/content/posts'

fixed_bodies = 0
fixed_fm = 0
skipped = 0

for root, dirs, files in os.walk(posts_dir):
    for fname in files:
        if fname != 'index.md':
            continue
        path = os.path.join(root, fname)
        with open(path, encoding='utf-8') as f:
            raw = f.read()

        # Split into front matter and body
        parts = raw.split('---', 2)
        if len(parts) < 3:
            continue
        pre, fm, body = parts[0], parts[1], parts[2]

        original_body = body
        original_fm = fm

        lines = body.split('\n')
        new_lines = []
        i = 0
        while i < len(lines):
            line = lines[i]
            m = re.match(r'^!\[\]\((\./images/[^)]+)\)(.*)$', line)
            if m:
                img_path = m.group(1)
                tail = m.group(2)  # anything after the closing paren (usually empty)

                # Look ahead past blank lines for a caption
                j = i + 1
                while j < len(lines) and lines[j].strip() == '':
                    j += 1

                if j < len(lines):
                    nxt = lines[j].strip()
                    # Only treat as bare caption if it's not already asterisk-wrapped,
                    # not another image, not a heading, not empty
                    if (nxt
                            and not nxt.startswith('*')
                            and not nxt.startswith('!')
                            and not nxt.startswith('#')):
                        caption = nxt
                        # Emit fixed image line
                        new_lines.append(f'![{caption}]({img_path}){tail}')
                        # Preserve blank lines between image and caption
                        for k in range(i + 1, j):
                            new_lines.append(lines[k])
                        # Emit asterisk-wrapped caption
                        new_lines.append(f'*{caption}*')
                        fixed_bodies += 1

                        # Also update front matter caption if it's empty for this image
                        fm_updated = re.sub(
                            r'(- path: "' + re.escape(img_path) + r'"[^\n]*\n\s*caption:) ""',
                            r'\1 "' + caption.replace('"', '\\"') + '"',
                            fm
                        )
                        if fm_updated != fm:
                            fm = fm_updated
                            fixed_fm += 1

                        i = j + 1
                        continue

                # No bare caption found — emit as-is
                new_lines.append(line)
            else:
                new_lines.append(line)
            i += 1

        new_body = '\n'.join(new_lines)

        if new_body != original_body or fm != original_fm:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(f'---{fm}---{new_body}')
        else:
            skipped += 1

print(f"Fixed {fixed_bodies} image captions in post bodies.")
print(f"Updated {fixed_fm} front matter caption fields.")
print(f"Posts with no changes: {skipped}")
