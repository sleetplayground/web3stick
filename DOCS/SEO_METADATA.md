# SEO and Metadata Implementation Guide for WEB3STICK

This document contains the recommended metadata and SEO implementation for the WEB3STICK project.

## Implementation Code

Add the following code block between the `<head>` tags in your HTML:

```html
<!-- Primary Meta Tags -->
<meta name="title" content="WEB3STICK" />
<meta name="description" content="A social experiment and playground project featuring stick figure NFTs on the NEAR blockchain. Create and customize your own web3stick account." />
<meta name="keywords" content="web3, NFT, NEAR Protocol, stick figure, blockchain, web3stick, cryptocurrency, digital art" />
<meta name="author" content="nonresistant.near and sleet.near" />
<meta name="theme-color" content="#DBB4DA" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://web3stick.near.page/" />
<meta property="og:title" content="WEB3STICK - Stick Figure NFTs on NEAR Protocol" />
<meta property="og:description" content="A social experiment and playground project featuring stick figure NFTs on the NEAR blockchain. Create and customize your own web3stick account." />
<meta property="og:image" content="/web3stick.png" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://web3stick.near.page/" />
<meta property="twitter:title" content="WEB3STICK - Stick Figure NFTs on NEAR Protocol" />
<meta property="twitter:description" content="A social experiment and playground project featuring stick figure NFTs on the NEAR blockchain. Create and customize your own web3stick account." />
<meta property="twitter:image" content="/web3stick.png" />

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/web3stick.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/web3stick.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/web3stick.png" />

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Knewave&family=Schoolbell&display=swap" rel="stylesheet" />
```

## Meta Tags Explanation

1. **Primary Meta Tags**:
   - Title and description optimized for search engines
   - Keywords targeting relevant blockchain and NFT terms
   - Author attribution to project creators
   - Theme color matching project palette

2. **Open Graph Tags**:
   - Optimized for social media sharing on Facebook and other platforms
   - Custom image preview using project logo
   - Detailed description for social shares

3. **Twitter Cards**:
   - Large image card format for better visibility
   - Consistent messaging with Open Graph tags
   - Optimized for Twitter sharing

4. **Favicon**:
   - Multiple sizes for different devices and contexts
   - Apple touch icon for iOS devices

5. **Fonts**:
   - Preconnect for faster font loading
   - Project fonts (Knewave and Schoolbell)

## Implementation Notes

1. Replace `/web3stick.png` with the actual path to your image if different
2. Update the URLs if your domain changes
3. Adjust the theme color (#DBB4DA) if branding changes
4. Make sure all image assets are properly optimized and available at the specified paths

## SEO Best Practices

1. Keep titles under 60 characters
2. Meta descriptions between 150-160 characters
3. Use relevant keywords naturally in content
4. Ensure all images have proper alt text
5. Maintain consistent branding across all platforms