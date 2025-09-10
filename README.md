# Furniture Scan API 🛋️

A powerful web scraping API built with NestJS that aggregates furniture data from multiple major retailers. This service automatically scans and compares furniture prices across various online stores, providing a unified API for furniture search and price comparison.

![Furniture Scan API](https://via.placeholder.com/800x200/2D3748/FFFFFF?text=Furniture+Scan+API)

## Features

🔍 **Multi-Store Scanning** - Searches across 7+ major furniture retailers  
⚡ **High Performance** - Parallel processing with intelligent caching  
🗄️ **Database Integration** - MySQL database with TypeORM for data persistence  
🤖 **Smart Scraping** - Puppeteer-based web scraping with stealth mode  
📊 **RESTful API** - Clean, documented API endpoints  
🛡️ **Error Handling** - Robust error handling and logging  
🏗️ **Modular Architecture** - Scalable NestJS module structure

## Supported Retailers

- **Costco** - Wholesale furniture and home goods
- **IKEA** - Scandinavian design furniture
- **Ashley HomeStore** - Traditional and contemporary furniture
- **Walmart** - Affordable furniture options
- **Home Depot** - Home improvement and furniture
- **Wayfair** - Online furniture and home decor
- **Living Spaces** - Modern furniture collections

## API Example

### Search Request
```http
GET /scan?search=chair
```

### Response
```json
[
  {
    "id": 1,
    "name": "Modern Office Chair",
    "price": "$299.99",
    "imageUrl": "https://...",
    "productLink": "https://...",
    "storeName": "ikea",
    "searchKeyword": "chair",
    "scrapedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- MySQL 8.0+ database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/furniture-scan-scraper.git
   cd furniture-scan-scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your-database-password
   DB_NAME=furniture_scan
   PORT=3000
   ```

4. **Set up the database**
   ```sql
   CREATE DATABASE furniture_scan;
   ```

5. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Verify the installation**
   ```bash
   curl "http://localhost:3000/scan?search=table"
   ```

## Testing the Application

### Manual Testing

1. **Health Check**
   ```bash
   curl -I http://localhost:3000
   ```

2. **Basic Search**
   ```bash
   curl "http://localhost:3000/scan?search=chair"
   ```

3. **Test Different Keywords**
   ```bash
   # Test various furniture types
   curl "http://localhost:3000/scan?search=sofa"
   curl "http://localhost:3000/scan?search=table"
   curl "http://localhost:3000/scan?search=bed"
   ```

### Automated Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

### Verify Features

- ✅ API responds to search queries
- ✅ Multiple stores are being scraped
- ✅ Results are cached in database
- ✅ Error handling works properly
- ✅ Logs are generated correctly

## API Documentation

### Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/scan` | Search furniture across all stores | `search` (required) |

### Parameters

- **search** (string, required): Keyword to search for (max 100 characters)

### Response Format

The API returns an array of furniture objects with the following structure:

```typescript
interface Furniture {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  productLink: string;
  storeName: string;
  searchKeyword: string;
  scrapedAt: Date;
}
```

## Project Structure

```
src/
├── common/
│   ├── interceptors/         # Logging and other interceptors
│   └── middlewares/          # Authentication and other middleware
├── services/
│   ├── furniture/            # Furniture entity and service
│   ├── scan/                 # Main scan orchestration
│   ├── scrapers/             # Abstract scraper classes
│   ├── costco/               # Costco-specific scraper
│   ├── ikea/                 # IKEA-specific scraper
│   ├── ashley/               # Ashley-specific scraper
│   ├── walmart/              # Walmart-specific scraper
│   ├── homedepot/            # Home Depot-specific scraper
│   ├── wayfair/              # Wayfair-specific scraper
│   └── livingSpaces/         # Living Spaces-specific scraper
├── app.module.ts             # Root application module
└── main.ts                   # Application entry point
```

## Built With

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[TypeORM](https://typeorm.io/)** - Object-Relational Mapping library
- **[Puppeteer](https://pptr.dev/)** - Headless Chrome API for web scraping
- **[MySQL](https://mysql.com/)** - Relational database system
- **[Jest](https://jestjs.io/)** - Testing framework

## Available Scripts

| Script | Description |
|--------|--------------|
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage report |
| `npm run lint` | Run ESLint code analysis |
| `npm run format` | Format code with Prettier |

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 3306 | Yes |
| `DB_USERNAME` | Database username | root | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | furniture_scan | Yes |
| `PORT` | Application port | 3000 | No |
| `NODE_ENV` | Environment mode | development | No |

## Performance Considerations

- **Caching**: Results are cached in the database to avoid redundant scraping
- **Parallel Processing**: Multiple stores are scraped simultaneously
- **Rate Limiting**: Built-in delays to respect website policies
- **Resource Management**: Proper browser instance cleanup

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if MySQL is running
sudo service mysql status

# Verify database credentials in .env
```

**Scraping Timeout Errors**
```bash
# Some sites may block automated requests
# Check logs for specific error messages
```

**High Memory Usage**
```bash
# Monitor Chrome processes
# Puppeteer instances should close properly
```

### Debugging

```bash
# Enable debug logging
NODE_ENV=development npm run start:dev

# Check application logs
tail -f logs/application.log
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NestJS team for the excellent framework
- Puppeteer team for the web scraping capabilities
- TypeORM team for the database integration
- All furniture retailers for providing public product information

---

## ⚠️ Important Notice

**Website Layout Dependencies**: This scraper relies on the current HTML structure and CSS selectors of the supported retailer websites. If any of these websites change their layout, design, or structure, the scraping functionality for those specific stores may no longer work as intended. Regular maintenance and updates to the scraper selectors may be required to ensure continued functionality.

**Disclaimer**: This tool is for educational and research purposes. Please respect the robots.txt and terms of service of the websites being scraped.
