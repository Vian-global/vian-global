const dbConnect = require('../_utils/db.js');
const News = require('../_models/News.js');
const { verifyToken } = require('../_utils/auth.js');
const sanitizeHtml = require('sanitize-html');

module.exports = async function handler(req, res) {
  await dbConnect();

  const method = req.method;

  switch (method) {
    // ── GET: FETCH ARTICLES ──────────────────────────────────────────
    case 'GET':
      try {
        const isAdmin = !!verifyToken(req);
        
        // Admins can see all articles (drafts + published). Public users only see published.
        const query = isAdmin ? {} : { status: 'published' };
        
        // Sorting: Featured articles first, then by creation date descending
        const articles = await News.find(query).sort({ isFeatured: -1, dateCreated: -1 });
        
        return res.status(200).json({ success: true, articles });
      } catch (error) {
        console.error('Fetch News Error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

    // ── POST: CREATE AN ARTICLE (SECURED) ─────────────────────────────
    case 'POST':
      try {
        const decoded = verifyToken(req);
        if (!decoded) {
          return res.status(401).json({ success: false, message: 'Unauthorized action' });
        }

        const {
          title,
          slug,
          content,
          excerpt,
          image,
          status,
          seo,
          category,
          tags,
          author,
          isFeatured,
        } = req.body;

        // Validations
        if (!title || !slug || !content || !excerpt || !image) {
          return res.status(400).json({
            success: false,
            message: 'Title, unique slug, content, excerpt, and featured image are required',
          });
        }

        // Slug validation: lowercase, hyphen-separated, unique
        const cleanSlug = slug
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // remove special chars
          .trim()
          .replace(/\s+/g, '-') // spaces to hyphens
          .replace(/-+/g, '-'); // collapse multiple hyphens

        const existingNews = await News.findOne({ slug: cleanSlug });
        if (existingNews) {
          return res.status(400).json({
            success: false,
            message: `The slug "${cleanSlug}" is already in use by another article. Slugs must be unique.`,
          });
        }

        // Secure Rich-Text XSS Sanitization
        const sanitizedContent = sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'h1', 'h2', 'img', 'span', 'div', 'u', 's', 'pre', 'code'
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'a': ['href', 'name', 'target', 'rel'],
            'img': ['src', 'alt', 'title', 'width', 'height', 'class', 'style'],
            'span': ['style', 'class'],
            'div': ['style', 'class'],
            'p': ['style', 'class'],
          },
          allowedStyles: {
            '*': {
              'color': [/^#/g, /^rgb/g, /^hsl/g],
              'background-color': [/^#/g, /^rgb/g, /^hsl/g],
              'text-align': [/^left$/g, /^right$/g, /^center$/g, /^justify$/g],
              'font-size': [/^\d+(px|em|rem|%)$/g],
              'padding-left': [/^\d+(px|em|rem|%)$/g],
            }
          }
        });

        // Auto-generate canonical URL if not provided
        const finalCanonical = (seo && seo.canonicalUrl) || `https://www.vianglobal.co/news/${cleanSlug}`;

        const articleData = {
          title,
          slug: cleanSlug,
          content: sanitizedContent,
          excerpt,
          image,
          status: status || 'draft',
          seo: {
            metaTitle: (seo && seo.metaTitle) || title,
            metaDescription: (seo && seo.metaDescription) || excerpt,
            ogImage: (seo && seo.ogImage) || image,
            canonicalUrl: finalCanonical,
          },
          category: category || 'General',
          tags: tags || [],
          author: author || decoded.username || 'Vian Team',
          isFeatured: !!isFeatured,
        };

        const newArticle = await News.create(articleData);

        return res.status(201).json({
          success: true,
          message: 'Article created successfully',
          article: newArticle,
        });

      } catch (error) {
        console.error('Create News Error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
