SIAL PROPERTY ADVISER — FREE TEMPORARY SETUP
================================================

FILES
- index.html: public website, approved listings from Supabase, bike scheme applications to existing Firebase Firestore.
- admin.html: Supabase admin sign-in, property add/edit/delete/approve, Cloudinary media upload.
- supabase_setup.sql: create table and Row Level Security policies.

IMPORTANT
- Firebase Storage is NOT used.
- Firebase Firestore is used only for bike scheme entries in collection `bikeApplications`.
- Property records use Supabase free project.
- Photos/videos use Cloudinary free account.
- Supabase and Cloudinary settings have already been inserted into the supplied HTML files. Review the steps below before deployment.
- The provided Firebase web config is visible to website visitors by design; secure Firestore with rules.

STEP 1 — SUPABASE (property listing records)
1. Open https://supabase.com and create a free project.
2. In project Settings -> API (or Connect), copy Project URL and anon/public key.
3. Open SQL Editor and run all contents of `supabase_setup.sql`.
4. In Authentication -> Users, create/invite the admin user with email:
   ramzansial65@gmail.com
   Set a strong password. If email confirmation is required, confirm the email before signing in.
5. Already configured in both HTML files:
   Project URL: https://mxckzszxihfnytjbzszg.supabase.co
   Publishable key: inserted in the frontend files (public key; never use a secret/service_role key).
6. Never put a Supabase service_role key in HTML.

STEP 2 — CLOUDINARY (photos/videos)
1. Create a free account: https://cloudinary.com/users/register_free
2. Open Console Settings -> Upload -> Upload presets -> Add upload preset.
3. Set Signing Mode = Unsigned; save and copy the preset name.
4. Restrict allowed formats to jpg, jpeg, png, webp for the image preset. Best practice: create separate unsigned presets for images and videos if you want stricter restrictions; this code currently uses one preset for both image and video upload endpoints, so allow jpg,jpeg,png,webp,mp4,webm,mov in the preset if the console supports that combined setup.
5. Already configured in admin.html:
   Cloud Name: gerhxhrz
   Unsigned preset: Sial-property
6. Never place Cloudinary API Secret in frontend code.
7. Unsigned presets can be abused by anyone who discovers the preset name; restrict formats, keep file sizes small, monitor usage and rotate preset if abused.

STEP 3 — FIREBASE BIKE SCHEME ONLY
1. In Firebase Console for project `sial-97a7a`, ensure Cloud Firestore is enabled.
2. The public site writes applications to `bikeApplications`; make sure your Firestore rules permit public creates with field validation and prevent public reads/updates/deletes.
3. Do not enable or use Firebase Storage.
4. Recommended starting Firestore rules (adapt if your existing rules include other collections):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bikeApplications/{applicationId} {
      allow create: if
        request.resource.data.keys().hasAll(['fullName','phone','city','cnic','salesPlan','termsAccepted','status','createdAt'])
        && request.resource.data.fullName is string
        && request.resource.data.fullName.size() > 1
        && request.resource.data.phone is string
        && request.resource.data.phone.size() >= 7
        && request.resource.data.termsAccepted == true
        && request.resource.data.status == 'pending';
      allow read, update, delete: if false;
    }
  }
}
NOTE: These rules intentionally don't let the public browser read bike applications. For admin viewing/approval of bike entries, add a secure admin-authenticated workflow separately. Do not weaken rules to public read.

STEP 4 — DEPLOY
1. Put index.html and admin.html in the same website folder.
2. Upload/deploy them to Netlify (or your current host).
3. Visit /admin.html and sign in with the Supabase admin account.
4. Add one test listing with a small photo; set status to Pending first.
5. Approve it from admin. Check the public index.html.
6. Test the bike scheme form separately.

LIMITS / TRADE-OFFS
- Free service quotas can change and may have bandwidth limits/sleep/usage policies.
- Browser compresses photos to JPEG before upload (max 1600px wide, about 78% quality). Transparent PNGs will become JPEG.
- Video isn't transcoded in the browser; code limits video upload to 30 MB. Compress/trim videos on your phone first.
- Cloudinary unsigned uploads do not support secure deletion from browser. Deleting a listing removes its Supabase record, but old media may remain in Cloudinary and use quota. Clean up media manually in Cloudinary console.
- Admin account security depends on Supabase Auth and RLS policy; only `ramzansial65@gmail.com` is allowed by the SQL policy.
- The original site design has been recreated in navy/gold glass style based on the described design; this has not been deployed or live-tested against your accounts.


CURRENT CONFIGURATION (inserted)
- Supabase project: mxckzszxihfnytjbzszg
- Supabase Project URL: https://mxckzszxihfnytjbzszg.supabase.co
- Cloudinary Cloud Name: gerhxhrz
- Cloudinary unsigned preset: Sial-property
- Admin email: ramzansial65@gmail.com

NEXT ACTIONS
1. Do NOT run supabase_setup.sql again if it already ran successfully.
2. Create the Supabase Auth user ramzansial65@gmail.com if not already created.
3. Confirm the Cloudinary preset is saved and its exact name is Sial-property (case-sensitive).
4. Deploy index.html and admin.html together in the same folder.
5. Open /admin.html, sign in, upload one small test photo and create a pending test listing.
6. Approve it, then check the public homepage.

The publishable Supabase key is intended for browser use. Never add a Supabase secret/service_role key or Cloudinary API Secret to these files.
