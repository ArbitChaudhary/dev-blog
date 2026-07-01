# Project Prompt: Production Blog App

Use this prompt to implement a production-grade blog application in this existing workspace.

## Implementation Prompt

Build a complete production-level multi-author blog application using the current stack in this repository:

- Next.js 16.2.9 with App Router, React 19, TypeScript strict mode, React Compiler enabled, and Turbopack default.
- AWS Amplify Gen 2 backend with Cognito auth, AppSync GraphQL data, DynamoDB storage, and S3 storage through the existing `blogDrive` bucket.
- Tailwind CSS v4 using the existing global CSS setup.
- Deploy target: AWS Amplify Hosting.

The app must be optimized, fast, low latency, SEO-ready, and production-safe. Use Server Components by default, keep Client Components only where interactivity is needed, and structure public routes for static rendering, ISR, streaming, and instant navigation. Follow the local Next.js 16 docs in `node_modules/next/dist/docs/` before writing framework-specific code.

Replace the starter Todo model with the complete blog schema below. Implement authentication and authorization for public readers, signed-in users, authors, and admins. Add an author dashboard with a rich Markdown editor, live preview, image uploads to S3, draft/scheduled/published workflows, revisions, comments, reactions, bookmarks, newsletter signup, search, RSS feed, sitemap, robots, OG images, JSON-LD structured data, dark mode, loading/error/not-found states, and production deployment configuration.

For performance:

- Public published post pages should use static generation and ISR where possible.
- Use `generateStaticParams` for published slugs.
- Use `revalidate` or cache tags for content freshness.
- Use `unstable_instant` on important public routes and place Suspense boundaries around uncached or request-time work.
- Keep comments, reactions, bookmarks, and personalized state streamed or client-side so they do not block the post shell.
- Avoid request-time APIs in the root layout unless absolutely required.
- Use optimized images, meaningful metadata, sitemap, RSS, robots, canonical URLs, and JSON-LD.

## Roles And Access

- Guest: read published public content, read approved comments, subscribe to newsletter.
- Authenticated user: create comments, reactions, bookmarks, manage own profile, manage own newsletter preferences.
- Author: create and manage own posts, drafts, media, revisions, and author profile.
- Admin: manage all content, users, comments, categories, tags, redirects, settings, search records, audit logs, and notifications.

## Enums

Use enum-like fields in the Amplify schema where supported.

- `UserRole`: `READER`, `AUTHOR`, `ADMIN`
- `UserStatus`: `ACTIVE`, `SUSPENDED`, `DELETED`
- `PostStatus`: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`
- `PostVisibility`: `PUBLIC`, `UNLISTED`, `PRIVATE`
- `CommentStatus`: `PENDING`, `APPROVED`, `REJECTED`, `SPAM`, `DELETED`
- `ReactionType`: `LIKE`, `LOVE`, `INSIGHTFUL`, `FIRE`, `CLAP`
- `NewsletterStatus`: `PENDING`, `CONFIRMED`, `UNSUBSCRIBED`, `BOUNCED`
- `MediaUsageType`: `AVATAR`, `POST_COVER`, `POST_INLINE`, `OG_IMAGE`, `SITE_ASSET`
- `AuditAction`: `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `UNPUBLISH`, `LOGIN`, `ROLE_CHANGE`, `MODERATE`
- `NotificationType`: `COMMENT`, `REACTION`, `POST_PUBLISHED`, `MENTION`, `SYSTEM`

## Data Models

### UserProfile

Represents one application profile per Cognito user.

Attributes:

- `id`: ID, required
- `owner`: String, required, Cognito owner/sub identity
- `email`: Email, required
- `username`: String, required, unique public handle
- `displayName`: String, required
- `avatarKey`: String, optional S3 key
- `bio`: String, optional
- `websiteUrl`: URL/String, optional
- `location`: String, optional
- `role`: UserRole, required, default `READER`
- `status`: UserStatus, required, default `ACTIVE`
- `twitterUrl`: URL/String, optional
- `githubUrl`: URL/String, optional
- `linkedinUrl`: URL/String, optional
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Has one `AuthorProfile`
- Has many `Comment`, `PostReaction`, `CommentReaction`, `Bookmark`, `Notification`, `AuditLog`

Indexes:

- By `owner`
- By `username`
- By `role`
- By `status`

Auth:

- Guest can read active public profile fields.
- Owner can read and update own profile.
- Admin can manage all profiles.

### AuthorProfile

Public author profile and author-specific metadata.

Attributes:

- `id`: ID, required
- `userProfileId`: ID, required
- `slug`: String, required, unique
- `byline`: String, optional
- `expertise`: String array, optional
- `featured`: Boolean, required, default `false`
- `bioLong`: String, optional
- `postCount`: Integer, required, default `0`
- `publishedPostCount`: Integer, required, default `0`
- `totalViews`: Integer, required, default `0`
- `totalReactions`: Integer, required, default `0`
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to `UserProfile`
- Has many `Post`

Indexes:

- By `userProfileId`
- By `slug`
- By `featured`

Auth:

- Guest can read author profiles.
- Linked owner/author can update own author profile.
- Admin can manage all author profiles.

### Post

Primary blog post model.

Attributes:

- `id`: ID, required
- `authorId`: ID, required
- `categoryId`: ID, optional
- `title`: String, required
- `slug`: String, required, unique
- `excerpt`: String, required
- `bodyMarkdown`: String, required
- `bodyHtml`: String, optional cached render
- `coverImageKey`: String, optional S3 key
- `coverAlt`: String, optional
- `status`: PostStatus, required, default `DRAFT`
- `visibility`: PostVisibility, required, default `PUBLIC`
- `featured`: Boolean, required, default `false`
- `canonicalUrl`: String, optional
- `readingMinutes`: Integer, required
- `viewCount`: Integer, required, default `0`
- `reactionCount`: Integer, required, default `0`
- `commentCount`: Integer, required, default `0`
- `bookmarkCount`: Integer, required, default `0`
- `publishedAt`: DateTime, optional
- `scheduledAt`: DateTime, optional
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to `AuthorProfile`
- Belongs to `Category`
- Has many `PostTag`, `Comment`, `PostReaction`, `Bookmark`, `PostRevision`
- Has one `SeoMetadata`

Indexes:

- By `slug`
- By `status` and `publishedAt`
- By `authorId` and `createdAt`
- By `categoryId` and `publishedAt`
- By `featured` and `publishedAt`

Auth:

- Guest can read only `PUBLISHED` and `PUBLIC` posts.
- Author owner can create and manage own posts.
- Admin can manage all posts.

### PostRevision

Immutable history of post changes.

Attributes:

- `id`: ID, required
- `postId`: ID, required
- `editorId`: ID, required UserProfile id
- `version`: Integer, required
- `title`: String, required
- `excerpt`: String, required
- `bodyMarkdown`: String, required
- `coverImageKey`: String, optional
- `status`: PostStatus, required
- `changeSummary`: String, optional
- `createdAt`: DateTime, generated

Relationships:

- Belongs to `Post`
- Belongs to editor `UserProfile`

Indexes:

- By `postId` and `version`
- By `editorId` and `createdAt`

Auth:

- Author can read revisions for own posts.
- Admin can read and manage all revisions.
- Revisions should not be public.

### Category

Hierarchical category model.

Attributes:

- `id`: ID, required
- `parentCategoryId`: ID, optional
- `name`: String, required
- `slug`: String, required, unique
- `description`: String, optional
- `color`: String, optional hex token
- `sortOrder`: Integer, required, default `0`
- `postCount`: Integer, required, default `0`
- `isVisible`: Boolean, required, default `true`
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Has many child `Category`
- Has many `Post`
- Has one `SeoMetadata`

Indexes:

- By `slug`
- By `parentCategoryId`
- By `sortOrder`
- By `isVisible`

Auth:

- Guest can read visible categories.
- Admin can manage categories.
- Authors can assign categories to own posts but not manage category records unless admin.

### Tag

Flat tagging model.

Attributes:

- `id`: ID, required
- `name`: String, required
- `slug`: String, required, unique
- `description`: String, optional
- `postCount`: Integer, required, default `0`
- `isVisible`: Boolean, required, default `true`
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Has many `PostTag`

Indexes:

- By `slug`
- By `name`
- By `isVisible`

Auth:

- Guest can read visible tags.
- Admin can manage tags.
- Authors can attach existing tags to own posts.

### PostTag

Join model between posts and tags.

Attributes:

- `id`: ID, required
- `postId`: ID, required
- `tagId`: ID, required
- `createdAt`: DateTime, generated

Relationships:

- Belongs to `Post`
- Belongs to `Tag`

Indexes:

- By `postId`
- By `tagId`
- Unique composite of `postId` and `tagId` if supported

Auth:

- Guest can read tag assignments for published posts.
- Post owner author can manage tag assignments on own posts.
- Admin can manage all tag assignments.

### Comment

Threaded comments on posts.

Attributes:

- `id`: ID, required
- `postId`: ID, required
- `parentCommentId`: ID, optional
- `authorUserId`: ID, optional for signed-in comments
- `guestName`: String, optional
- `guestEmailHash`: String, optional for moderation identity, never expose publicly
- `body`: String, required
- `status`: CommentStatus, required, default `PENDING`
- `moderationReason`: String, optional
- `depth`: Integer, required, default `0`
- `reactionCount`: Integer, required, default `0`
- `ipHash`: String, optional, private moderation field
- `userAgentHash`: String, optional, private moderation field
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to `Post`
- Belongs to optional `UserProfile`
- Has many child `Comment`
- Has many `CommentReaction`

Indexes:

- By `postId` and `createdAt`
- By `parentCommentId` and `createdAt`
- By `authorUserId` and `createdAt`
- By `status` and `createdAt`

Auth:

- Guest can read approved comments.
- Authenticated users can create comments.
- Comment owner can update/delete own pending comments.
- Author can moderate comments on own posts.
- Admin can moderate all comments.

### CommentReaction

Reaction to a comment.

Attributes:

- `id`: ID, required
- `commentId`: ID, required
- `userId`: ID, required
- `reactionType`: ReactionType, required
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to `Comment`
- Belongs to `UserProfile`

Indexes:

- By `commentId`
- By `userId`
- Unique composite of `commentId`, `userId`, and `reactionType` if supported

Auth:

- Guest can read aggregate reaction data.
- Authenticated user can create/delete own reactions.
- Admin can delete abusive reactions.

### PostReaction

Reaction to a post.

Attributes:

- `id`: ID, required
- `postId`: ID, required
- `userId`: ID, required
- `reactionType`: ReactionType, required
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to `Post`
- Belongs to `UserProfile`

Indexes:

- By `postId`
- By `userId`
- Unique composite of `postId`, `userId`, and `reactionType` if supported

Auth:

- Guest can read aggregate reaction data.
- Authenticated user can create/delete own reactions.
- Admin can delete abusive reactions.

### Bookmark

Saved post per user.

Attributes:

- `id`: ID, required
- `postId`: ID, required
- `userId`: ID, required
- `createdAt`: DateTime, generated

Relationships:

- Belongs to `Post`
- Belongs to `UserProfile`

Indexes:

- By `userId` and `createdAt`
- By `postId`
- Unique composite of `postId` and `userId` if supported

Auth:

- Authenticated user can create/read/delete own bookmarks.
- Admin can manage bookmarks only for abuse/support needs.
- Bookmarks are not public.

### NewsletterSubscriber

Newsletter subscription and consent record.

Attributes:

- `id`: ID, required
- `email`: Email, required
- `emailHash`: String, required
- `status`: NewsletterStatus, required, default `PENDING`
- `source`: String, optional, for signup surface
- `confirmationTokenHash`: String, optional
- `confirmedAt`: DateTime, optional
- `unsubscribedAt`: DateTime, optional
- `consentText`: String, optional
- `consentVersion`: String, optional
- `ipHash`: String, optional, private
- `userAgentHash`: String, optional, private
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Optional link to `UserProfile` can be added later if needed

Indexes:

- By `emailHash`
- By `status` and `createdAt`
- By `source`

Auth:

- Guest and authenticated users can subscribe/unsubscribe through controlled actions.
- Admin can read/manage subscribers.
- Never expose raw subscriber list publicly.

### MediaAsset

Metadata for S3 objects used by the blog.

Attributes:

- `id`: ID, required
- `ownerId`: ID, required UserProfile id
- `s3Key`: String, required
- `bucketPath`: String, required
- `mimeType`: String, required
- `sizeBytes`: Integer, required
- `width`: Integer, optional
- `height`: Integer, optional
- `altText`: String, optional
- `caption`: String, optional
- `usageType`: MediaUsageType, required
- `checksum`: String, optional
- `isPublic`: Boolean, required, default `false`
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to owner `UserProfile`

Indexes:

- By `ownerId` and `createdAt`
- By `usageType` and `createdAt`
- By `s3Key`
- By `isPublic`

Auth:

- Guest can read metadata for public media only.
- Owner can manage own media.
- Admin can manage all media.

### SeoMetadata

SEO override metadata for posts, categories, authors, and pages.

Attributes:

- `id`: ID, required
- `entityType`: String, required, values like `POST`, `CATEGORY`, `AUTHOR`, `PAGE`
- `entityId`: ID, required
- `title`: String, required
- `description`: String, required
- `canonicalUrl`: String, optional
- `ogImageKey`: String, optional
- `twitterImageKey`: String, optional
- `noIndex`: Boolean, required, default `false`
- `jsonLdOverride`: String, optional JSON text
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Logical relation to entity by `entityType` and `entityId`

Indexes:

- By `entityType` and `entityId`
- By `noIndex`

Auth:

- Guest can read SEO metadata for public content.
- Author can manage SEO metadata for own posts.
- Admin can manage all SEO metadata.

### Redirect

SEO redirect table.

Attributes:

- `id`: ID, required
- `sourcePath`: String, required, unique
- `targetPath`: String, required
- `statusCode`: Integer, required, usually `301` or `302`
- `active`: Boolean, required, default `true`
- `hitCount`: Integer, required, default `0`
- `createdById`: ID, optional
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Optional belongs to creator `UserProfile`

Indexes:

- By `sourcePath`
- By `active`

Auth:

- Public runtime can read active redirects.
- Admin can manage redirects.

### SiteSetting

Site-wide settings and singleton-style config records.

Attributes:

- `id`: ID, required
- `key`: String, required, unique
- `value`: String, required JSON text or scalar string
- `description`: String, optional
- `isPublic`: Boolean, required, default `false`
- `updatedById`: ID, optional
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Recommended keys:

- `site.title`
- `site.description`
- `site.logoKey`
- `site.defaultOgImageKey`
- `site.twitterHandle`
- `newsletter.provider`
- `comments.moderationMode`
- `seo.defaultCanonicalBaseUrl`

Indexes:

- By `key`
- By `isPublic`

Auth:

- Guest can read public settings.
- Admin can manage all settings.

### SearchDocument

Denormalized search index document for AppSync-backed search.

Attributes:

- `id`: ID, required
- `entityType`: String, required, usually `POST`, `CATEGORY`, `TAG`, `AUTHOR`
- `entityId`: ID, required
- `slug`: String, required
- `title`: String, required
- `excerpt`: String, optional
- `bodyText`: String, optional
- `categoryName`: String, optional
- `tagNames`: String array, optional
- `authorName`: String, optional
- `status`: String, required
- `visibility`: String, required
- `publishedAt`: DateTime, optional
- `boost`: Integer, required, default `0`
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Logical relation to source entity by `entityType` and `entityId`

Indexes:

- By `entityType` and `entityId`
- By `status` and `publishedAt`
- By `slug`
- By `boost`

Auth:

- Guest can read search docs for published public content only.
- Author can update search docs for own posts through controlled backend logic.
- Admin can manage all search docs.

Future upgrade:

- Replace or supplement with OpenSearch/Algolia when ranking, typo tolerance, stemming, or high-volume full-text search is needed.

### AuditLog

Immutable admin and content event log.

Attributes:

- `id`: ID, required
- `actorId`: ID, optional UserProfile id
- `action`: AuditAction, required
- `entityType`: String, required
- `entityId`: ID, optional
- `summary`: String, required
- `metadataJson`: String, optional JSON text
- `ipHash`: String, optional private
- `userAgentHash`: String, optional private
- `createdAt`: DateTime, generated

Relationships:

- Optional belongs to actor `UserProfile`

Indexes:

- By `actorId` and `createdAt`
- By `entityType` and `entityId`
- By `action` and `createdAt`
- By `createdAt`

Auth:

- Admin can read audit logs.
- Backend/system can create audit logs.
- Logs should not be publicly readable or user-editable.

### Notification

In-app notification for authors/admins/users.

Attributes:

- `id`: ID, required
- `userId`: ID, required recipient
- `type`: NotificationType, required
- `title`: String, required
- `body`: String, optional
- `entityType`: String, optional
- `entityId`: ID, optional
- `actionUrl`: String, optional
- `readAt`: DateTime, optional
- `createdAt`: DateTime, generated
- `updatedAt`: DateTime, generated

Relationships:

- Belongs to recipient `UserProfile`

Indexes:

- By `userId` and `createdAt`
- By `userId` and `readAt`
- By `type` and `createdAt`

Auth:

- User can read/update own notifications.
- Admin can create/manage notifications when needed.
- Notifications are not public.

## Storage Paths

Use the existing `blogDrive` S3 bucket. Recommended paths:

- `public/blog/posts/{postId}/cover/*`: published cover images
- `public/blog/posts/{postId}/inline/*`: published inline images
- `public/blog/authors/{authorId}/avatar/*`: public avatars
- `public/blog/og/*`: generated OG images
- `protected/{identityId}/drafts/*`: draft uploads before publish
- `protected/{identityId}/uploads/*`: authenticated uploads

Guest access should be read-only for public paths. Authenticated authors should write only to their own protected paths and controlled post media paths. Admin should have broad management access.

## Required Routes

Public routes:

- `/`: home with featured posts, latest posts, categories, newsletter signup
- `/blog`: paginated post listing
- `/blog/[slug]`: post detail with ISR and instant navigation
- `/category/[slug]`: category archive
- `/tag/[slug]`: tag archive
- `/author/[slug]`: author profile and posts
- `/search`: search UI
- `/rss.xml`: RSS feed route
- `/sitemap.xml`: sitemap route or `sitemap.ts`
- `/robots.txt`: robots route or `robots.ts`

Auth and dashboard routes:

- `/sign-in`
- `/sign-up`
- `/account`
- `/dashboard`
- `/dashboard/posts`
- `/dashboard/posts/new`
- `/dashboard/posts/[id]/edit`
- `/dashboard/media`
- `/dashboard/comments`
- `/dashboard/settings` for admins

## Required UI Features

- Responsive app shell with header, navigation, search entry, auth state, and footer.
- Dark mode toggle with persisted preference.
- Post cards with category, author, date, reading time, tags, and cover image.
- Markdown post rendering with accessible typography and code block styling.
- Rich Markdown editor with live preview, image upload, excerpt, category, tags, SEO fields, and publish controls.
- Comment thread with moderation states.
- Reaction and bookmark controls for signed-in users.
- Newsletter signup with confirmation/unsubscribe flow placeholders.
- Loading, error, and not-found boundaries.

## Delivery Checklist

- Amplify schema compiles and replaces starter Todo model.
- Auth groups and model authorization rules are implemented.
- Storage paths and access rules are updated.
- Frontend uses typed Amplify data clients.
- Public pages build with static/ISR behavior.
- Important routes use `unstable_instant` and Suspense boundaries.
- SEO metadata, RSS, sitemap, robots, canonical URLs, and JSON-LD are present.
- Dashboard supports draft, schedule, publish, edit, and revision workflows.
- Comments, reactions, bookmarks, newsletter, search, and notifications are implemented.
- `npm run lint` and `npm run build` pass.
- Amplify sandbox/deploy verification succeeds.
