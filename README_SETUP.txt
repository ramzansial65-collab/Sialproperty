SIAL PROPERTY ADVISER — MULTI-PAGE WEBSITE PACKAGE
==================================================

WHAT IS INCLUDED
- index.html              Existing aligned homepage and its original features
- properties.html         Approved Supabase property listings, filters and compare
- calculator.html         Buy / Rent / Investment calculator
- investment.html         Rental-yield estimator and due-diligence guide
- local-guidance.html     Guidance checklist and WhatsApp enquiry form
- bike-scheme.html        Firebase Firestore application form
- about.html              About / service overview
- contact.html            Phone, WhatsApp and enquiry form
- admin.html              Existing admin panel (preserved; noindex added)
- assets/styles.css       Shared navy / gold glass design
- assets/config.js        Public browser configuration
- assets/*.js             Page-specific interactions
- assets/favicon.svg      Matching gold house favicon
- sitemap.xml             Public-page sitemap
- robots.txt              Crawler instructions; admin excluded
- 404.html                Matching not-found page
- supabase_setup.sql      Existing database setup (not changed)

DESIGN
The homepage is based on the latest Calculator Aligned file from 21 November 2026.
Its existing navy/gold design, 15-image hero slideshow, compact right-side calculator,
property cards, Supabase listing loader, favourites, comparison, buyer checklist,
Firebase bike application form, WhatsApp newsletter handoff and footer are retained.
New pages share the same header, footer, fonts, colours, glass panels and mobile menu.

IMPORTANT BACKEND NOTES
1. Supabase is used for property listing records only.
   Project URL: https://mxckzszxihfnytjbzszg.supabase.co
   Public publishable key is in assets/config.js and the existing admin.html.
   Never put a Supabase secret/service_role key in browser files.
2. Cloudinary uploads remain configured in the existing admin.html:
   cloud name gerhxhrz, unsigned preset Sial-property.
   Never put a Cloudinary API secret in browser files.
3. Firebase Firestore remains for Bike Scheme application submissions only:
   project sial-97a7a, collection bikeApplications.
   Firebase Storage is not used.
4. The Bike Scheme page submits applications with status "pending".
   The current package does NOT include an authenticated admin screen for
   reading/approving Bike Scheme applications or verifying payments. Do not
   advertise an application as approved or a payment as verified.
5. The Supabase setup SQL is included for reference. Since it was already
   successfully run, do NOT run it again unless the database has been reset.

DEPLOY WITH SPCK / NETLIFY
1. Download and extract the ZIP.
2. Open the extracted Sial_Property_Adviser_Multi_Page folder in Spck or your
   file manager. Keep the assets folder and all HTML files together.
3. Upload/deploy the CONTENTS of this folder to the Netlify site root.
   index.html must be at the root, not inside an extra nested folder.
4. Test these URLs:
   /                  homepage
   /properties.html   property directory
   /calculator.html   calculator
   /investment.html   investment guide
   /local-guidance.html
   /bike-scheme.html
   /about.html
   /contact.html
   /admin.html        existing admin panel
5. Sign in to /admin.html with the existing Supabase admin account.
   Create a small test listing, approve it, then check properties.html and
   the homepage. Do not change existing database policies just to make a test pass.
6. Test a Bike Scheme application with a controlled test record. Confirm
   Firestore rules permit public create and deny public read/update/delete.

SEO
- Every public page has a unique title, description, canonical URL and Open Graph tags.
- sitemap.xml lists the eight public pages. Submit:
  https://sialpropertyadviser.netlify.app/sitemap.xml
  in Google Search Console.
- robots.txt excludes /admin.html from crawling.
- The admin page also carries noindex/nofollow.
- If you deploy to a DIFFERENT Netlify subdomain or custom domain, update the
  SITE/canonical/og URLs in the HTML files, sitemap.xml and robots.txt first.
- Search Console indexing is not guaranteed immediately. A sitemap submission
  is a discovery signal, not a ranking or indexing guarantee.

SEO LIMITATION TO KNOW
Property cards are fetched in the browser from Supabase. This package creates
the public directory page and page-level SEO metadata, but it does not generate
a separate crawlable HTML URL for each database listing. For reliable indexing
of individual properties, a later server-side/static page generation step
(Netlify Functions or a build-time listing export) is still needed.

CONTACT DETAILS TO CONFIRM
- The existing footer email address and social-media links were preserved from the source file.
  Confirm that the email mailbox exists and replace the generic social links with the official
  Sial Property Adviser profile URLs before launch if they are different.

LIVE TESTING LIMITATION
Files were checked locally for HTML parsing, duplicate IDs, internal links,
JavaScript syntax and sitemap XML. The live Supabase, Firebase, Cloudinary and
Netlify accounts were not logged into or changed by this package generation.
Run the deployment checks above before announcing the site as fully live.
