# 🌱 Urban Gardening - Plant Search API Integration

## Setting Up the Plant Search API

The plant search feature supports real plant data from external APIs. Follow these steps to integrate your API key:

### Supported Plant APIs

#### 1. **Perenual Plant API** (Recommended)
- **Website**: https://perenual.com/docs/api
- **Free Tier**: 300 requests/day
- **Features**: 10,000+ plants, detailed information, images

**How to get your API key:**
1. Go to https://perenual.com/api-key
2. Sign up for a free account
3. Copy your API key from the dashboard

#### 2. **Trefle API** (Alternative)
- **Website**: https://trefle.io
- **Free Tier**: 120 requests/day
- **Features**: 400,000+ plants, extensive data

**How to get your API key:**
1. Visit https://trefle.io
2. Create an account
3. Generate your API token

### Setting Your API Key

#### Method 1: Browser Console (Quick Test)
1. Open your browser's developer console (F12)
2. Run this command:
```javascript
setPlantAPIKey("YOUR_API_KEY_HERE");
```

#### Method 2: Edit the JavaScript File
1. Open `src/js/plant-search.js`
2. Find line 6:
```javascript
constructor(apiKey = '') {
```
3. Add your API key:
```javascript
constructor(apiKey = 'YOUR_API_KEY_HERE') {
```

#### Method 3: Environment Variable (Recommended for Production)
1. Create a `.env` file in your project root:
```
PLANT_API_KEY=YOUR_API_KEY_HERE
```
2. Use environment variable loader (if using build tools)

### Using Without API Key

Don't have an API key yet? **No problem!** 

The search system includes **mock data** with 10 popular plants:
- Tomato
- Basil
- Snake Plant
- Mint
- Pothos
- Lettuce
- Rose
- Lavender
- Aloe Vera
- Strawberry

The search will automatically use mock data if no API key is configured.

## Search Features

### What You Can Search
- **Plant Names**: "tomato", "basil", "rose"
- **Scientific Names**: "Solanum lycopersicum"
- **Plant Types**: "herb", "vegetable", "succulent"
- **Characteristics**: "edible", "medicinal", "indoor"

### Search Capabilities
- ✅ Real-time search as you type (debounced)
- ✅ Search results with images
- ✅ Detailed plant information modal
- ✅ Plant tags (edible, medicinal, indoor-friendly)
- ✅ Care requirements (sunlight, watering, cycle)
- ✅ Add plants to your garden
- ✅ Mobile-responsive design
- ✅ Caching for faster subsequent searches

## API Response Format

The system expects this data structure:
```javascript
{
  id: 1,
  name: "Plant Name",
  scientificName: "Scientific Name",
  description: "Plant description",
  image: "image_url",
  tags: ["tag1", "tag2"],
  type: "Vegetable/Herb/Flower/etc",
  cycle: "Annual/Perennial",
  watering: "Minimum/Average/Frequent",
  sunlight: ["Full sun", "Part shade"],
  edible: true/false,
  medicinal: true/false,
  indoor: true/false
}
```

## Customization

### Change API Provider
Edit `src/js/plant-search.js`:
```javascript
this.baseURL = 'https://your-api-provider.com/api';
```

Then update the `searchPlants()` method to match your API's format.

### Adjust Cache Duration
Default: 30 minutes. To change:
```javascript
this.cacheExpiry = 60 * 60 * 1000; // 1 hour in milliseconds
```

### Modify Search Delay
Default: 500ms. To change in `src/js/search-handler.js`:
```javascript
searchTimeout = setTimeout(() => {
    performSearch(query);
}, 1000); // 1 second delay
```

## Testing

### Test with Mock Data
1. Open `index.html`
2. Click the search bar
3. Type "tomato" or "basil"
4. See results appear

### Test with Real API
1. Set your API key (see above)
2. Search for any plant name
3. Results will come from the live API
4. Fallback to mock data if API fails

## Troubleshooting

### "No results found"
- Check your search query spelling
- Try broader terms (e.g., "rose" instead of "red rose")
- Ensure API key is valid if using real API

### API Errors
The system automatically falls back to mock data if:
- API key is invalid
- Rate limit exceeded
- Network error occurs

### Search not working
1. Check browser console for errors (F12)
2. Verify JavaScript files are loaded:
   - `plant-search.js`
   - `search-handler.js`
3. Ensure search elements exist in HTML

## File Structure

```
src/
├── js/
│   ├── plant-search.js      # API integration & mock data
│   ├── search-handler.js    # Search UI & event handlers
│   ├── database.js          # IndexedDB integration
│   └── profile.js           # Garden management
├── css/
│   ├── style.css            # Search bar styles
│   └── responsive.css       # Mobile search styles
└── html/
    └── index.html           # Search bar HTML
```

## Features Integrated

- [x] Search bar in navigation
- [x] Live search with debouncing
- [x] API integration (Perenual)
- [x] Mock data fallback
- [x] Search results dropdown
- [x] Plant detail modal
- [x] Add to garden functionality
- [x] Mobile responsive design
- [x] Error handling
- [x] Loading states
- [x] Result caching

## Next Steps

1. **Get API Key**: Sign up at https://perenual.com/api-key
2. **Configure Key**: Use `setPlantAPIKey("your-key")`
3. **Test Search**: Try searching for plants
4. **Customize**: Adjust styling and behavior as needed

## Support

For API documentation:
- Perenual: https://perenual.com/docs/api
- Trefle: https://docs.trefle.io

For code questions, check the inline comments in:
- `src/js/plant-search.js`
- `src/js/search-handler.js`

---

**Happy Gardening! 🌿**
