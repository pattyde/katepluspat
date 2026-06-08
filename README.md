# katepluspat.com

Travel blog for Kate and Pat. Built with [Astro](https://astro.build), deployed to GitHub Pages.

---

## First-time setup (Windows)

You only need to do this section once. If you've already set up your computer, skip to [Getting the project onto your computer](#getting-the-project-onto-your-computer).

### 1. Install VS Code

VS Code is the text editor you'll use to write posts.

1. Go to [code.visualstudio.com](https://code.visualstudio.com) and click **Download for Windows**
2. Run the installer — the default options are all fine
3. Open VS Code once the install is done to confirm it works

### 2. Install Git

Git is how you save and sync changes with the website.

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win) and download the installer
2. Run the installer — most defaults are fine, but on the screen that says **"Choosing the default editor used by Git"**, change it from Vim to **Use Visual Studio Code as Git's default editor**
3. Keep clicking Next and then Install
4. Once installed, search for **Git Bash** in the Start menu and open it — this is the terminal you'll use from now on

### 3. Install Node.js

Node.js is required to run the site locally on your computer. It also installs npm automatically.

1. Go to [nodejs.org](https://nodejs.org) and download the **LTS** version (the one labelled "Recommended For Most Users")
2. Run the installer — the default options are all fine
3. Once installed, open Git Bash and check it worked by running:

   ```sh
   node --version
   npm --version
   ```

   Both commands should print a version number. If they don't, close and reopen Git Bash and try again.

### 4. Configure Git with your name and email

Git tags every change you make with your name and email. Open Git Bash and run these two commands (replace the name and email with your own):

```sh
git config --global user.name "Name"
git config --global user.email "your@email.com"
```

### 5. Create a GitHub account

If you don't already have one, go to [github.com](https://github.com) and sign up for a free account.

### 6. Create an SSH key

An SSH key is like a secure password that lets your computer talk to GitHub without you having to type a password every time.

**Create the key:**

Open Git Bash and run (replace with your own email):

```sh
ssh-keygen -t ed25519 -C "your@email.com"
```

When it asks where to save it, just press **Enter** to accept the default location. When it asks for a passphrase, you can press **Enter** twice to skip it (no passphrase).

**Copy the key:**

```sh
cat ~/.ssh/id_ed25519.pub
```

This prints your public key to the screen. Select all of that text and copy it (it starts with `ssh-ed25519` and ends with your email).

**Add the key to GitHub:**

1. Go to [github.com/settings/keys](https://github.com/settings/keys)
2. Click **New SSH key**
3. Give it a title like "My Windows laptop"
4. Paste the key into the **Key** field
5. Click **Add SSH key**

**Test that it works:**

```sh
ssh -T git@github.com
```

You should see a message like: `Hi [username]! You've successfully authenticated...`

### 7. Get access to the repository

Ask Pat to add your GitHub account as a collaborator on the repository. He can do this from the repository's **Settings → Collaborators** page on GitHub.

---

## Getting the project onto your computer (first time only)

Once you have access, open Git Bash and run:

```sh
git clone git@github.com:pattyde/katepluspat.git
cd katepluspat
npm install
```

- `git clone` downloads the whole project to your computer
- `cd katepluspat` opens that folder in the terminal
- `npm install` downloads all the packages the site needs — this may take a minute or two

You only need to do this once. From now on, just open Git Bash and `cd` into the folder to get started:

```sh
cd katepluspat
```

---

## Running the site locally

Starting the local dev server lets you preview your changes in a browser before publishing.

```sh
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321) in your browser. The site will live-reload as you save files.

Press `Ctrl + C` in the terminal to stop the server when you're done.

---

## Before making any changes — always pull first

Before you start writing a new post, make sure your local copy is up to date with any changes that have been pushed since you last worked on it:

```sh
git pull
```

This downloads the latest changes from GitHub. Skipping this step can cause conflicts later.

---

## Adding a new post

### Step 1 — Create the post folder

In VS Code, open the `katepluspat` folder (File → Open Folder). Then inside `src/content/posts/`, find the relevant trip folder and create a new subfolder. The folder name should start with the next post number, followed by a short title with hyphens instead of spaces:

```
src/content/posts/[trip-slug]/[post-number]-[short-title]/
```

Trip slugs are: `honeymoon`, `europe-2023`, `europe-2024`

Example:
```
src/content/posts/europe-2024/028-palaces-and-pastries/
```

### Step 2 — Create `index.md`

Inside the new folder, create a file called `index.md`. Copy this template and fill in the details:

```yaml
---
title: "Post Title"
subtitle: "Optional subtitle"
date: 2025-01-18
author: katepluspat
trip: europe-2024
country: Malaysia
city: Kuala Lumpur
tags: []
images:
  - path: "./images/photo.jpg"
    caption: "Optional caption"
---

Post body goes here...
```

**Field notes:**
- `date` — use the format `YYYY-MM-DD` (e.g. `2025-01-18`)
- `country` — must match the country name used on other posts for the same country (check an existing post if unsure — capitalisation matters)
- `city` — the city you were in. Optional but recommended — it shows up in the post list and at the top of each post
- `tags` — can be left as `[]` if you don't want any tags
- `images` — list every photo you want available in the post. The first one will be used as the post thumbnail

### Step 3 — Add images

Create an `images/` subfolder inside your post folder and copy your photos in:

```
src/content/posts/europe-2024/028-palaces-and-pastries/
├── index.md
└── images/
    ├── IMG_0001.jpg
    └── IMG_0002.jpg
```

You can do this by dragging and dropping files in VS Code's file explorer on the left.

### Step 4 — Reference images in the post body

In the body of `index.md` (below the second `---`), add images like this:

```markdown
![Caption text](./images/IMG_0001.jpg)

*Caption text*
```

The line in italics (`*...*`) becomes a visible caption below the image. Two consecutive image blocks will automatically display side by side.

### Step 5 — Write the post body

Post content is written in **Markdown** — a simple way to format text using plain characters. Here are the most common things you'll need:

```markdown
## Heading

Regular paragraph text just gets typed as-is.
Leave a blank line between paragraphs.

**This text is bold**

*This text is italic*

> This is a blockquote — useful for pulling out a quote or highlight.

- Bullet point one
- Bullet point two
- Bullet point three
```

For a full reference, see the [Markdown Basic Syntax guide](https://www.markdownguide.org/basic-syntax/).

---

## Saving and publishing your changes

Once you've written your post and are happy with it, you need to commit and push your changes to GitHub. Pushing to GitHub automatically rebuilds and publishes the live site.

### Step 1 — Check what files you've changed

Open Git Bash and make sure you're in the project folder, then run:

```sh
git status
```

This shows a list of new and modified files. New files appear under "Untracked files" in red.

### Step 2 — Stage your changes

Staging tells Git which files you want to include in your next save. Add your new post folder:

```sh
git add src/content/posts/europe-2024/028-palaces-and-pastries/
```

Or to stage everything at once:

```sh
git add .
```

Run `git status` again — staged files should now appear in green.

### Step 3 — Commit with a message

```sh
git commit -m "Add post: Palaces and Pastries"
```

This saves a snapshot of your staged changes. The message after `-m` is a short note for your reference — keep it brief.

### Step 4 — Push to GitHub

```sh
git push
```

This uploads your commit to GitHub. The site will automatically rebuild and go live within a minute or two. You can watch the progress under the **Actions** tab at [github.com/pattyde/katepluspat](https://github.com/pattyde/katepluspat).

---

## Adding a new trip

1. Create a new YAML file in `src/content/trips/`:

   ```yaml
   # src/content/trips/my-new-trip.yaml
   title: "Trip Title"
   subtitle: "Optional subtitle"
   slug: "my-new-trip"
   dateRange: "Jan–Feb 2026"
   countries:
     - Australia
   summary: "Short description shown on the home page."
   heroImage: "/images/heroes/my-new-trip-hero.jpg"
   ```

2. Add a hero image to `public/images/heroes/`.

3. Create posts under `src/content/posts/my-new-trip/`.

4. Follow the same commit and push steps above to publish.

---

## Troubleshooting

**`git pull` says "divergent branches"**

This happens when both you and Pat have pushed changes since you last synced. Fix it with:

```sh
git pull --rebase
git push
```

**The dev server won't start**

Try running `npm install` again — there may be new dependencies since you last pulled.

**`npm` or `node` is not recognised**

Close Git Bash completely, reopen it, and try again. If that doesn't work, reinstall Node.js.

**My post isn't showing up**

- Check the `trip` field in your frontmatter exactly matches the trip slug (e.g. `europe-2024`, not `Europe 2024`)
- Check the `date` is in `YYYY-MM-DD` format
- Make sure the file is named `index.md` (not `Index.md` or `post.md`)

**Permission denied when pushing**

Your SSH key may not be set up correctly. Run `ssh -T git@github.com` — if it doesn't say "successfully authenticated", go back through Step 6 of the first-time setup.
