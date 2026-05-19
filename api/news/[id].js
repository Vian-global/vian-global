const dbConnect = require('../_utils/db.js');
const News = require('../_models/News.js');
const { verifyToken } = require('../_utils/auth.js');
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

module.exports = async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID or Slug parameter is required' });
  }

  // Helper to determine if a string is a valid MongoDB ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  const query = isValidObjectId ? { _id: id } : { slug: id.toLowerCase() };

  const method = req.method;

  switch (method) {
    // ── GET: FETCH SINGLE ARTICLE (PUBLIC OR SECURED DRAFT) ───────────
    case 'GET':
      try {
        const article = await News.findOne(query);

        if (!article) {
          return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // If the article is a draft, only authenticated admins can view it
        if (article.status === 'draft') {
          const isAdmin = !!verifyToken(req);
          if (!isAdmin) {
            return res.status(404).json({ success: false, message: 'Article not found' });
          }
        }

        return res.status(200).json({ success: true, article });
      } catch (error) {
        console.error('Fetch Single News Error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

    // ── PUT: UPDATE AN ARTICLE (SECURED) ──────────────────────────────
    case 'PUT':
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

        const article = await News.findOne(query);
        if (!article) {
          return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Slug validation if updated: lowercase, hyphen-separated, unique
        let finalSlug = article.slug;
        if (slug) {
          const cleanSlug = slug
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

          if (cleanSlug !== article.slug) {
            const existingNews = await News.findOne({ slug: cleanSlug });
            if (existingNews) {
              return res.status(400).json({
                success: false,
                message: `The slug "${cleanSlug}" is already in use by another article. Slugs must be unique.`,
              });
            }
            finalSlug = cleanSlug;
          }
        }

        // Secure Rich-Text HTML Sanitization (XSS prevention)
        let sanitizedContent = article.content;
        if (content) {
          sanitizedContent = sanitizeHtml(content, {
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
        }

        // Update fields
        if (title) article.title = title;
        article.slug = finalSlug;
        if (content) article.content = sanitizedContent;
        if (excerpt) article.excerpt = excerpt;
        if (image) article.image = image;
        if (status) article.status = status;
        if (category) article.category = category;
        if (tags) article.tags = tags;
        if (author) article.author = author;
        if (typeof isFeatured !== 'undefined') article.isFeatured = !!isFeatured;

        // SEO Fields Update
        if (seo) {
          article.seo = {
            metaTitle: seo.metaTitle || article.seo.metaTitle || title || article.title,
            metaDescription: seo.metaDescription || article.seo.metaDescription || excerpt || article.excerpt,
            ogImage: seo.ogImage || article.seo.ogImage || image || article.image,
            canonicalUrl: seo.canonicalUrl || article.seo.canonicalUrl || `https://www.vianglobal.co/news/${finalSlug}`,
          };
        }

        await article.save();

        return res.status(200).json({
          success: true,
          message: 'Article updated successfully',
          article,
        });

      } catch (error) {
        console.error('Update News Error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

    // ── DELETE: REMOVE AN ARTICLE (SECURED) ───────────────────────────
    case 'DELETE':
      try {
        const decoded = verifyToken(req);
        if (!decoded) {
          return res.status(401).json({ success: false, message: 'Unauthorized action' });
        }

        const article = await News.findOneAndDelete(query);

        if (!article) {
          return res.status(404).json({ success: false, message: 'Article not found' });
        }

        return res.status(200).json({
          success: true,
          message: 'Article deleted successfully',
          articleId: article._id,
        });

      } catch (error) {
        console.error('Delete News Error:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
