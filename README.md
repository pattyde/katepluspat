# katepluspat.com

Travel blog for Kate and Pat. Built with [Astro](https://astro.build), deployed to GitHub Pages.

## Local development

```sh
npm install        # install dependencies (first time only)
npm run dev        # start dev server at http://localhost:4321
npm run build      # production build + pagefind search index
npm run preview    # preview the production build locally (required to test search)
```

## Adding a new post

1. **Create the post folder** inside the relevant trip directory:

   ```
   src/content/posts/[trip-slug]/[post-slug]/
   ```

   Trip slugs are: `honeymoon`, `europe-2023`, `europe-2024`

   Example:
   ```
   src/content/posts/europe-2024/028-my-new-post/
   ```

2. **Create `index.md`** inside that folder with this front matter:

   ```yaml
   ---
   title: "Post Title"
   subtitle: "Optional subtitle"
   date: 2025-01-18
   author: katepluspat
   trip: europe-2024
   country: Malaysia
   tags:
     - optional tag
   images:
     - path: "./images/photo.jpg"
       caption: "Optional caption"
   ---

   Post body goes here...
   ```

3. **Add images** into an `images/` subfolder alongside `index.md`:

   ```
   src/content/posts/europe-2024/028-my-new-post/
   ├── index.md
   └── images/
       └── photo.jpg
   ```

4. **Reference images in the body** using relative paths:

   ```markdown
   ![Caption text](./images/photo.jpg)

   *Caption text*
   ```

   Two consecutive image blocks will automatically display side by side when both are portrait/small.

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

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which builds the site and deploys to GitHub Pages automatically. The search index is rebuilt as part of every deploy.
