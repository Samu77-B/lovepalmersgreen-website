// News functions for Loves Palmers Green website
// Using reliable fallback data when external feeds fail

// Configuration
const NEWS_SOURCES = {
  // External news sources (may not always be available due to CORS issues)
  local: 'https://feeds.bbci.co.uk/news/uk/london/rss.xml',
  business: 'https://feeds.bbci.co.uk/news/business/rss.xml'
};

// CORS proxy to try accessing external feeds
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Local news fallback data
const LOCAL_NEWS_FALLBACK = [
  {
    title: "Devonshire Square Launches as New Cultural Hub in Palmers Green",
    description: "The newly completed Devonshire Square has officially launched as a cultural and community space in the heart of Palmers Green. The project includes new seating areas, sustainable drainage, and mosaic artwork created with local students.",
    pubDate: "15 Jun 2025",
    link: "https://letstalk.enfield.gov.uk/palmersgreen/news_feed/devonshire-square-a-new-outdoor-cultural-and-community-space-in-the-heart-of-palmers-green",
    image: "images/park-renovation.jpg"
  },
  {
    title: "Palmers Green Festival Returns to Broomfield Park",
    description: "The popular Palmers Green Festival is back at Broomfield Park for 2025. This free community event features live music, a food festival, funfair, and the popular Vintage Village organized by the Palmers Green Action Team.",
    pubDate: "10 Jun 2025",
    link: "https://www.fobp.uk/PGFESTIVAL",
    image: "images/farmers-market.jpg"
  },
  {
    title: "Summer-Long Events Series Planned for Broomfield Park",
    description: "Friends of Broomfield Park have announced the return of the Broomfield Summer Festival. Now in its fifth year, the festival offers a season of outdoor cultural events with the help of young 'festival makers' aged 16-25.",
    pubDate: "5 Jun 2025",
    link: "https://enfielddispatch.co.uk/summer-long-series-of-events-planned-in-palmers-green-park/",
    image: "images/cleanup-day.jpg"
  },
  {
    title: "Community-Led Markets Continue on Devonshire Road",
    description: "Following their success since late 2022, the community-led markets on Devonshire Road are continuing with an expanded schedule. Visitors can enjoy local produce, crafts, and al fresco dining throughout the summer months.",
    pubDate: "1 Jun 2025",
    link: "https://www.palmersgreenactionteam.org/streetmarkets",
    image: "images/bookshop.jpg"
  },
  {
    title: "New Public Art Installation at Triangle Clock Tower",
    description: "A new public art installation has been unveiled at the iconic Triangle Clock Tower in Palmers Green. The installation celebrates the area's history and was created through collaboration with local artists and community groups.",
    pubDate: "28 May 2025",
    link: "https://www.absolutelykareen.co.uk/the-palmers-green-triangle-clock/",
    image: "images/art-gallery.jpg"
  },
  {
    title: "Green Lanes Cycle Project Enters Final Phase",
    description: "The protected cycle lane project along Green Lanes is entering its final phase. The initiative aims to improve cyclist safety and promote sustainable transportation throughout Palmers Green.",
    pubDate: "20 May 2025",
    link: "https://www.theguardian.com/cities/2015/oct/05/bike-lane-blues-london-local-businesses-cycle-enfield-green-lanes",
    image: "images/cycle-lane.jpg"
  }
];

// Business news fallback data
const BUSINESS_NEWS_FALLBACK = [
  {
    title: "Alfred Herring Pub Reopens as Sports Bar with New Food Menu",
    description: "The Alfred Herring pub on Green Lanes has reopened under new management as a vibrant sports bar with an exciting food offering, filling the 6,500 sq ft space that was formerly a Wetherspoons for over 15 years.",
    pubDate: "18 Jun 2025",
    link: "https://enfielddispatch.co.uk/palmers-green-pub-set-to-reopen-after-wetherspoon-sale/",
    image: "images/business-grant.jpg"
  },
  {
    title: "Green's Kitchen Expands with New Modern Coffee Shop in Palmers Green",
    description: "Green's Kitchen has unveiled their newly remodeled coffee shop in the heart of Palmers Green, offering a modern setting for brunch, lunch and casual dining, along with convenient takeaway options.",
    pubDate: "12 Jun 2025",
    link: "https://greenskitchen.uk/",
    image: "images/networking.jpg"
  },
  {
    title: "Independent Businesses Thrive on Green Lanes",
    description: "Green Lanes continues to boast the highest proportion of independent shops in Enfield, with local business leaders highlighting the area's unique character and community-focused retail environment.",
    pubDate: "5 Jun 2025",
    link: "https://www.thisislocallondon.co.uk/news/4395565.business-focus-palmers-green-businesses-in-the-spotlight/",
    image: "images/coworking.jpg"
  },
  {
    title: "Harris and Houle Named Top Café in Palmers Green",
    description: "Local favorite Harris and Houle has been recognized as the top café in Palmers Green by customer reviews, known for its quality coffee and welcoming atmosphere for residents and visitors alike.",
    pubDate: "28 May 2025",
    link: "https://www.yelp.com/search?cflt=cafes&find_loc=Palmers+Green%2C+London",
    image: "images/restaurant-award.jpg"
  },
  {
    title: "Business Support Workshop Series Launched for Local Entrepreneurs",
    description: "Enfield Council has introduced a new series of business support workshops specifically designed for Palmers Green entrepreneurs, covering topics from digital marketing to sustainable business practices.",
    pubDate: "20 May 2025",
    link: "https://letstalk.enfield.gov.uk/palmersgreen",
    image: "images/marketing-workshop.jpg"
  },
  {
    title: "Baskervilles Tea Shop Celebrates 10 Years in Palmers Green",
    description: "The popular Baskervilles Tea Shop is marking its 10th anniversary with special events and a commemorative menu, having become a cherished part of the local community over the past decade.",
    pubDate: "15 May 2025",
    link: "https://www.facebook.com/BaskervillesTeaShop/",
    image: "images/business-hub.jpg"
  }
];

// Function to fetch and display general news
function refreshNews() {
  const newsContainer = document.getElementById('news-container');
  const loadingMessage = newsContainer.querySelector('.loading-message') || 
                        newsContainer.querySelector('div[style*="text-align: center"]'); // Fallback
  
  // Show loading message
  if (loadingMessage) {
    loadingMessage.style.display = 'block';
    loadingMessage.innerHTML = '<div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #333; animation: spin 1s ease-in-out infinite;"></div><p style="margin-top: 15px;">Loading latest news...</p>';
  }

  // Try to fetch from RSS feed first
  console.log('Attempting to fetch news from external source...');
  const proxyUrl = CORS_PROXY + encodeURIComponent(NEWS_SOURCES.local);
  
  fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      try {
        // Clear loading message
        if (loadingMessage) {
          loadingMessage.style.display = 'none';
        }
        
        // Parse RSS XML data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        if (items.length === 0) {
          throw new Error('No news items found in the feed');
        }
        
        // Create news grid container
        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';
        newsGrid.style.display = 'grid';
        newsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Fixed two-column layout
        newsGrid.style.gap = '20px';
        
        // Process each news item (limit to 6 items)
        Array.from(items).slice(0, 6).forEach(item => {
          const link = item.querySelector('link')?.textContent || '';
          const newsObj = {
            title: item.querySelector('title')?.textContent || 'No Title',
            description: item.querySelector('description')?.textContent || '',
            pubDate: item.querySelector('pubDate')?.textContent || new Date().toUTCString(),
            link: link || 'https://enfielddispatch.co.uk/' // Use actual link or fallback to a valid URL
          };
          const newsCard = createNewsCard(newsObj);
          newsGrid.appendChild(newsCard);
        });
        
        // Replace content in container
        const existingGrid = newsContainer.querySelector('.news-grid');
        if (existingGrid) {
          newsContainer.replaceChild(newsGrid, existingGrid);
        } else {
          // Need to find where to append the grid - use the loading message as reference
          if (loadingMessage && loadingMessage.parentNode) {
            loadingMessage.parentNode.insertBefore(newsGrid, loadingMessage);
          } else {
            newsContainer.appendChild(newsGrid);
          }
        }
      } catch (error) {
        console.error('Error parsing news data:', error);
        // If there's an error parsing the RSS feed, use fallback data
        displayFallbackNews(newsContainer, loadingMessage);
      }
    })
    .catch(error => {
      console.error('Error fetching news from external source:', error);
      // If there's an error fetching the RSS feed, use fallback data
      displayFallbackNews(newsContainer, loadingMessage);
    });
}

// Function to display fallback news when external feeds fail
function displayFallbackNews(container, loadingMessage) {
  console.log('Using fallback news data');
  
  // Hide loading message if present
  if (loadingMessage) {
    loadingMessage.style.display = 'none';
  }
  
  // Create news grid
  const newsGrid = document.createElement('div');
  newsGrid.className = 'news-grid';
  newsGrid.style.display = 'grid';
  newsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  newsGrid.style.gap = '20px';
  
  // Add fallback news items
  LOCAL_NEWS_FALLBACK.forEach(item => {
    const newsCard = createNewsCard(item);
    newsGrid.appendChild(newsCard);
  });
  
  // Replace or add grid to container
  const existingGrid = container.querySelector('.news-grid');
  if (existingGrid) {
    container.replaceChild(newsGrid, existingGrid);
  } else {
    container.appendChild(newsGrid);
  }
  
  // Fallback notification has been removed as requested
}

// Function to fetch and display business news
function refreshBusinessNews() {
  const businessNewsContainer = document.getElementById('business-news-container');
  const loadingMessage = businessNewsContainer.querySelector('.loading-message');
  
  // Show loading message
  if (loadingMessage) {
    loadingMessage.style.display = 'block';
    loadingMessage.innerHTML = '<div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #333; animation: spin 1s ease-in-out infinite;"></div><p style="margin-top: 15px;">Loading business news...</p>';
  }

  // Try to fetch from RSS feed first
  console.log('Attempting to fetch business news from external source...');
  const proxyUrl = CORS_PROXY + encodeURIComponent(NEWS_SOURCES.business);
  
  fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      try {
      // Clear loading message
      if (loadingMessage) {
        loadingMessage.style.display = 'none';
      }
      
      // Parse RSS XML data
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');
      
      // Create news grid container
      const newsGrid = document.createElement('div');
      newsGrid.className = 'news-grid';
      newsGrid.style.display = 'grid';
      newsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Fixed two-column layout
      newsGrid.style.gap = '20px';
      
      // Process each news item (limit to 6 items)
      Array.from(items).slice(0, 6).forEach(item => {
        const link = item.querySelector('link')?.textContent || '';
        const newsObj = {
          title: item.querySelector('title')?.textContent || 'No Title',
          description: item.querySelector('description')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || new Date().toUTCString(),
          link: link || 'https://enfielddispatch.co.uk/business/' // Use actual link or fallback to a valid URL
        };
        const newsCard = createNewsCard(newsObj);
        newsGrid.appendChild(newsCard);
      });
      
      // Replace content in container
      const existingGrid = businessNewsContainer.querySelector('.news-grid');
      if (existingGrid) {
        businessNewsContainer.replaceChild(newsGrid, existingGrid);
      } else {
        businessNewsContainer.appendChild(newsGrid);
      }
      } catch (error) {
        console.error('Error parsing business news data:', error);
        // If there's an error parsing the RSS feed, use fallback data
        displayFallbackBusinessNews(businessNewsContainer, loadingMessage);
      }
    })
    .catch(error => {
      console.error('Error fetching business news from external source:', error);
      // If there's an error fetching the RSS feed, use fallback data
      displayFallbackBusinessNews(businessNewsContainer, loadingMessage);
    });
}

// Function to display fallback business news when external feeds fail
function displayFallbackBusinessNews(container, loadingMessage) {
  console.log('Using fallback business news data');
  
  // Hide loading message if present
  if (loadingMessage) {
    loadingMessage.style.display = 'none';
  }
  
  // Create news grid
  const newsGrid = document.createElement('div');
  newsGrid.className = 'news-grid';
  newsGrid.style.display = 'grid';
  newsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  newsGrid.style.gap = '20px';
  
  // Add fallback news items
  BUSINESS_NEWS_FALLBACK.forEach(item => {
    const newsCard = createNewsCard(item);
    newsGrid.appendChild(newsCard);
  });
  
  // Replace or add grid to container
  const existingGrid = container.querySelector('.news-grid');
  if (existingGrid) {
    container.replaceChild(newsGrid, existingGrid);
  } else {
    container.appendChild(newsGrid);
  }
  
  // Business news fallback notification has been removed as requested
}

// Helper function to create a news card
function createNewsCard(item) {
  const card = document.createElement('div');
  card.className = 'news-card';
  card.style.border = '1px solid #e0e0e0';
  card.style.borderRadius = '8px';
  card.style.overflow = 'hidden';
  card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.height = '100%';
  
  // Extract image if available (different parsing for RSS)
  let imageUrl = '';
  const imgMatch = item.description?.match(/<img[^>]+src="([^">\']+)"/i);
  if (imgMatch && imgMatch[1]) {
    imageUrl = imgMatch[1];
  }
  
  // For RSS feeds with media:content or enclosure tags
  if (!imageUrl) {
    const mediaContent = item.querySelector?.('media\\:content, media\\:thumbnail, enclosure');
    if (mediaContent && mediaContent.getAttribute('url')) {
      imageUrl = mediaContent.getAttribute('url');
    }
  }
  
  // Create image container if image available
  if (imageUrl) {
    const imageContainer = document.createElement('div');
    imageContainer.style.height = '180px';
    imageContainer.style.overflow = 'hidden';
    
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = item.title;
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'cover';
    
    imageContainer.appendChild(image);
    card.appendChild(imageContainer);
  }
  
  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.style.padding = '16px';
  contentContainer.style.flex = '1';
  contentContainer.style.display = 'flex';
  contentContainer.style.flexDirection = 'column';
  
  // Add title
  const title = document.createElement('h3');
  title.style.fontSize = '18px';
  title.style.fontWeight = '600';
  title.style.marginTop = '0';
  title.style.marginBottom = '8px';
  title.textContent = item.title;
  contentContainer.appendChild(title);
  
  // Add date
  const date = document.createElement('p');
  date.style.fontSize = '14px';
  date.style.color = '#666';
  date.style.margin = '0 0 10px 0';
  
  const pubDate = new Date(item.pubDate);
  date.textContent = pubDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  contentContainer.appendChild(date);
  
  // Add description snippet
  const description = document.createElement('p');
  description.style.fontSize = '14px';
  description.style.margin = '0 0 16px 0';
  description.style.flex = '1';
  
  // Strip HTML and limit to 100 characters
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = item.description;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  description.textContent = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
  
  contentContainer.appendChild(description);
  
  // Add read more link
  const linkContainer = document.createElement('div');
  linkContainer.style.marginTop = 'auto';
  
  const link = document.createElement('a');
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Read More';
  link.className = 'news-read-more';
  link.style.display = 'inline-block';
  link.style.padding = '8px 16px';
  link.style.background = 'linear-gradient(to bottom, #555555, #333333, #222222)';
  link.style.color = '#fff';
  link.style.textDecoration = 'none';
  link.style.borderRadius = '4px';
  link.style.fontWeight = '500';
  
  link.addEventListener('mouseover', () => {
    link.style.background = 'linear-gradient(to bottom, #666666, #444444, #333333)';
  });
  
  link.addEventListener('mouseout', () => {
    link.style.background = 'linear-gradient(to bottom, #555555, #333333, #222222)';
  });
  
  linkContainer.appendChild(link);
  contentContainer.appendChild(linkContainer);
  card.appendChild(contentContainer);
  
  return card;
}

// Initialize news sections on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for news containers and load news if they exist
  const newsContainer = document.getElementById('news-container');
  const businessNewsContainer = document.getElementById('business-news-container');
  
  // Set up refresh button event listeners
  const refreshNewsButton = document.getElementById('refresh-news-button');
  const refreshBusinessNewsButton = document.getElementById('refresh-business-news-button');
  
  if (refreshNewsButton) {
    refreshNewsButton.addEventListener('click', () => {
      console.log('Refreshing news...');
      refreshNews();
    });
  }
  
  if (refreshBusinessNewsButton) {
    refreshBusinessNewsButton.addEventListener('click', () => {
      console.log('Refreshing business news...');
      refreshBusinessNews();
    });
  }
  
  // Debug information
  console.log('News feed setup with CORS proxy');
  console.log('News container found:', !!newsContainer);
  console.log('Business news container found:', !!businessNewsContainer);
  console.log('Refresh news button found:', !!refreshNewsButton);
  console.log('Refresh business news button found:', !!refreshBusinessNewsButton);
  
  if (newsContainer) {
    // Add small delay to let the page render first
    console.log('Initial news load');
    setTimeout(refreshNews, 500);
  } else {
    console.error('News container not found. Make sure there is an element with id="news-container" in your HTML');
  }
  
  if (businessNewsContainer) {
    // Add small delay to let the page render first
    console.log('Initial business news load');
    setTimeout(refreshBusinessNews, 500);
  } else {
    console.error('Business news container not found. Make sure there is an element with id="business-news-container" in your HTML');
  }
});
