# Gifs-App-Angular - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Core Services](#core-services)
6. [Routing System](#routing-system)
7. [Components](#components)
8. [Data Models & Interfaces](#data-models--interfaces)
9. [Setup & Development](#setup--development)
10. [Build & Deployment](#build--deployment)
11. [Testing](#testing)

---

## Project Overview

**Gifs-App-Angular** is a practice project designed to learn and demonstrate Angular framework capabilities. The application allows users to browse trending GIFs and search for specific GIFs using the Giphy API.

- **Repository**: `Srpotato25/Gifs-app-Angular`
- **Primary Language**: TypeScript (77.1%)
- **Secondary Languages**: HTML (22.8%), CSS (0.1%)
- **Purpose**: Learning project - Practice #3 for Angular mastery
- **Created**: June 22, 2026
- **Status**: Active (Last updated: September 11, 2026)

---

## Technology Stack

### Core Framework
- **Angular**: v21.2.0
- **Angular CLI**: v21.2.9
- **TypeScript**: v5.9.2
- **Node Package Manager**: npm v11.12.1

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/common` | ^21.2.0 | Common Angular utilities |
| `@angular/compiler` | ^21.2.0 | Angular template compilation |
| `@angular/core` | ^21.2.0 | Core Angular framework |
| `@angular/forms` | ^21.2.0 | Form handling and validation |
| `@angular/platform-browser` | ^21.2.0 | Browser platform services |
| `@angular/router` | ^21.2.0 | Application routing |
| `rxjs` | ~7.8.0 | Reactive programming library |
| `tailwindcss` | ^4.3.0 | Utility-first CSS framework |
| `@tailwindcss/postcss` | ^4.3.0 | PostCSS support for Tailwind |
| `postcss` | ^8.5.15 | CSS transformation tool |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/build` | ^21.2.9 | Angular build tooling |
| `@angular/compiler-cli` | ^21.2.0 | Offline Angular compiler |
| `typescript` | ~5.9.2 | TypeScript language support |
| `vitest` | ^4.0.8 | Unit testing framework |
| `jsdom` | ^28.0.0 | DOM implementation for testing |
| `prettier` | ^3.8.1 | Code formatter |

---

## Project Structure

```
Gifs-app-Angular/
├── src/
│   ├── app/
│   │   ├── app.config.ts           # Application configuration
│   │   ├── app.routes.ts           # Routing configuration
│   │   ├── app.ts                  # Root component
│   │   └── gifs/
│   │       ├── services/
│   │       │   └── gifs.service.ts # GIF data management service
│   │       ├── interfaces/
│   │       │   ├── gif.interface.ts
│   │       │   └── giphy.interface.ts
│   │       ├── mapper/
│   │       │   └── gif.mapper.ts   # Data transformation mapper
│   │       ├── pages/
│   │       │   ├── dashboard-page/
│   │       │   ├── trending-page/
│   │       │   ├── search-page/
│   │       │   └── gif-history/
│   │       └── components/
│   │           ├── gif-list/
│   │           └── side-menu/
│   │               └── side-menu-options/
│   ├── environments/
│   │   ├── environment.ts          # Production environment config
│   │   └── environment.development.ts
│   ├── styles.css                  # Global styles
│   └── main.ts                     # Application entry point
├── angular.json                    # Angular CLI configuration
├── package.json                    # Project dependencies
├── tsconfig.app.json              # TypeScript configuration
├── tsconfig.json                  # Root TypeScript configuration
└── README.md                       # Project readme

```

---

## Architecture

### Overall Design Pattern

The application follows Angular's **component-based architecture** with a **service-oriented data layer**:

```
┌─────────────────────────────────────────┐
│         Root Component (App)            │
│       Application Bootstrap             │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼──────┐          ┌──────▼───┐
    │ Router   │          │ Config   │
    │ Outlet   │          │ HTTP     │
    └───┬──────┘          └──────────┘
        │
    ┌───▼─────────────────────────────┐
    │    Dashboard Page (Layout)      │
    │  (Side Menu + Router Outlet)    │
    └───┬─────────────────────────────┘
        │
        ├──────────────┬─────────────┬──────────────┐
        │              │             │              │
    ┌───▼───────┐  ┌──▼──────┐  ┌──▼──────┐  ┌───▼────┐
    │ Trending  │  │ Search  │  │ History │  │ Menu   │
    │   Page    │  │  Page   │  │  Page   │  │Options │
    └───┬───────┘  └──┬──────┘  └──┬──────┘  └────────┘
        │             │            │
        │      ┌──────┴────┐       │
        │      │           │       │
        └──────┼───────────┼───────┘
               │           │
           ┌───▼───────────▼──────┐
           │  GIFs Service        │
           │  (Signals, State)    │
           └───┬──────────────────┘
               │
           ┌───▼────────────────────┐
           │ Giphy API Integration  │
           │ HTTP Client            │
           └────────────────────────┘
```

### Data Flow

1. **User Interaction** → Component captures user input
2. **Service Call** → Component injects GifsService and calls methods
3. **HTTP Request** → Service makes API call to Giphy
4. **Data Transformation** → GifMapper converts API response to app models
5. **State Update** → Signal updates trigger component re-renders
6. **Local Storage** → Search history persists automatically via effect
7. **UI Render** → Components display updated data

---

## Core Services

### GifsService

**Location**: `src/app/gifs/services/gifs.service.ts`

**Purpose**: Manages all GIF data fetching, caching, and local storage operations.

#### Key Properties

```typescript
@Injectable({ providedIn: 'root' })
export class GifsService {
  // Signals for state management
  trendingGifs = signal<Gif[]>([]);
  trendngGifSLoading = signal(true);
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));
  
  // HttpClient for API calls
  private http = inject(HttpClient);
}
```

#### Core Methods

##### `loadTrendingGifs()`
- **Purpose**: Fetch trending GIFs from Giphy API on service initialization
- **API Endpoint**: `GET /gifs/trending`
- **Parameters**: 
  - `api_key`: Giphy API key from environment
  - `limit`: 20 GIFs per request
- **Side Effects**: 
  - Updates `trendingGifs` signal
  - Sets `trendngGifSLoading` to false
  - Logs response to console

##### `searchGifs(query: string)`
- **Purpose**: Search for GIFs matching a query string
- **API Endpoint**: `GET /gifs/search`
- **Parameters**:
  - `api_key`: Giphy API key
  - `limit`: 20 results
  - `q`: Search query
- **Returns**: Observable<Gif[]>
- **Behavior**:
  - Maps Giphy response to Gif array
  - Updates search history in signal
  - Persists to localStorage automatically via effect
- **RxJS Operators Used**:
  - `map()`: Transform API response to app models
  - `tap()`: Update history side effect

##### `getHistoryGifs(query: string)`
- **Purpose**: Retrieve previously searched GIFs for a specific query
- **Returns**: Gif[] (empty array if query not found)
- **Source**: In-memory signal (localStorage-backed)

#### State Management Features

- **Signals**: Used for reactive state (trending GIFs, search history)
- **Computed**: Derives search history keys from history signal
- **Effect**: Automatically saves search history to localStorage whenever it changes
- **Local Storage Key**: `'gifs'`

#### Data Persistence

```typescript
saveGifsToLocalStorage = effect(() => {
  const historyString = JSON.stringify(this.searchHistory());
  localStorage.setItem('gifs', historyString);
});
```

This effect automatically runs whenever `searchHistory()` signal changes, ensuring data survives page refreshes.

---

## Routing System

### Configuration

**Location**: `src/app/app.routes.ts`

The application uses Angular's standalone component routing with lazy loading.

#### Route Hierarchy

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page'),
    children: [
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page'),
      },
      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page'),
      },
      {
        path: 'history/:query',
        loadComponent: () => import('./gifs/pages/gif-history/gif-history'),
      },
      {
        path: '**',
        redirectTo: 'trending',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
```

#### Route Breakdown

| Path | Type | Purpose | Load Strategy |
|------|------|---------|---|
| `/dashboard` | Parent | Main application layout | Eager |
| `/dashboard/trending` | Child | Display trending GIFs | Lazy |
| `/dashboard/search` | Child | Search interface for GIFs | Lazy |
| `/dashboard/history/:query` | Child | View previous search results | Lazy |
| `**` | Wildcard | Catch-all redirect | - |

#### Lazy Loading
- Child routes use `loadComponent` for code splitting
- Components only loaded when route is activated
- Improves initial bundle size and load time

#### Default Routes
- Unknown dashboard routes redirect to `/dashboard/trending`
- Any root-level unknown routes redirect to `/dashboard`

---

## Components

### Page Components

#### DashboardPage
- **Purpose**: Main layout container with navigation
- **Location**: `src/app/gifs/pages/dashboard-page/`
- **Features**:
  - Side menu with navigation options
  - Router outlet for child pages
  - Standalone component

#### TrendingPage
- **Purpose**: Display trending GIFs
- **Location**: `src/app/gifs/pages/trending-page/trending-page.ts`
- **Dependencies**: GifsService, GifList component
- **Behavior**:
  - Injects GifsService
  - Accesses `trendingGifs` signal from service
  - Passes data to GifList component
  - Auto-loads trending GIFs on service initialization

```typescript
@Component({
  selector: 'app-trending-page',
  imports: [GifList],
  templateUrl: './trending-page.html',
})
export default class TrendingPage {
  gifsFromOuterSpace = inject(GifsService);
}
```

#### SearchPage
- **Purpose**: Search interface for finding GIFs
- **Location**: `src/app/gifs/pages/search-page/search-page.ts`
- **State**: Maintains `gifs` signal for search results
- **Methods**:
  - `onSearch(query: string)`: Triggers search and updates results

```typescript
export default class SearchPage {
  gifsDogs = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifsDogs.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
```

#### GifHistory
- **Purpose**: Display previously searched GIFs for a specific query
- **Location**: `src/app/gifs/pages/gif-history/gif-history.ts`
- **Route Parameters**: `:query` - The search term to retrieve history for
- **Key Feature**: Uses `toSignal()` to convert route parameters to reactive signal

```typescript
@Component({
  selector: 'gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html'
})
export default class GifHistory {
  gifsService = inject(GifsService);
  
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(params => params['query'])
    )
  );
  
  gifsByKey = computed(() => {
    return this.gifsService.getHistoryGifs(this.query());
  });
}
```

### UI Components

#### GifList
- **Purpose**: Reusable component for displaying GIF collections
- **Location**: `src/app/gifs/components/gif-list/`
- **Input**: Array of Gif objects
- **Responsibility**: Render GIFs in a grid/list layout

#### SideMenuOptions
- **Purpose**: Navigation menu in dashboard sidebar
- **Location**: `src/app/gifs/components/side-menu/side-menu-options/side-menu-options.ts`
- **Features**:
  - RouterLink for navigation
  - Menu options array with icons and labels
  - Search history display (via GifsService)

```typescript
interface MenuOption {
  label: string;
  subLabel: string;
  route: string;
  icon: string;
}

export class SideMenuOptions {
  History = inject(GifsService);
  
  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      subLabel: 'Gifs Populares',
      route: '/dashboard/trending'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscador',
      subLabel: 'Buscar gifs',
      route: '/dashboard/search'
    },
  ];
}
```

---

## Data Models & Interfaces

### Gif Interface

**Location**: `src/app/gifs/interfaces/gif.interface.ts`

```typescript
export interface Gif {
  id: string;      // Unique identifier
  title: string;   // GIF title/description
  url: string;     // Direct URL to GIF media
}
```

**Purpose**: Defines the shape of GIF data throughout the application

### GiphyResponse Interface

**Location**: `src/app/gifs/interfaces/giphy.interface.ts`

Represents the raw response from Giphy API with the following structure:
- `data`: Array of GiphyItem objects (raw API response)
- Additional metadata from Giphy API

### GifMapper

**Location**: `src/app/gifs/mapper/gif.mapper.ts`

**Purpose**: Transform raw Giphy API responses to application Gif objects

**Key Method**: `GifMapper.mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[]`
- Converts Giphy data format to app-specific format
- Extracts id, title, and image URL
- Ensures type safety and data consistency

---

## Setup & Development

### Prerequisites
- Node.js (compatible with npm 11.12.1)
- npm 11.12.1 or higher
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Srpotato25/Gifs-app-Angular.git
cd Gifs-app-Angular
```

2. **Install dependencies**
```bash
npm install
```

### Development Server

Start the development server with live reload:

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`

**Features**:
- Automatic reload on file changes
- Source maps for debugging
- Development-specific environment configuration

### Development Environment Configuration

**Location**: `src/environments/environment.development.ts`

Differences from production:
- Optimization disabled for faster builds
- License extraction disabled
- Source maps enabled for debugging
- File replacements for environment-specific code

---

## Build & Deployment

### Production Build

```bash
npm run build
# or
ng build
```

**Output**: Compiled application in `dist/` directory

### Build Configuration

**Location**: `angular.json`

#### Production Build Settings
- **Budgets**: 
  - Initial bundle: 500kB warning / 1MB error
  - Component styles: 4kB warning / 8kB error
- **Optimizations**: Enabled
- **Output Hashing**: All files
- **Tree Shaking**: Enabled

#### Development Build Settings
- **Optimizations**: Disabled
- **Source Maps**: Enabled
- **Watch Mode**: Available via `npm run watch`

### Bundle Analysis

Build size is controlled through Angular's budget configuration. Monitor these metrics:
- Initial bundle size (main bundle)
- Per-component style sizes
- Tree-shaking effectiveness

---

## Testing

### Unit Testing

**Framework**: Vitest v4.0.8

Run unit tests:

```bash
npm test
# or
ng test
```

**Test Configuration**:
- Test runner: Vitest (faster than Jasmine)
- DOM implementation: jsdom for Node.js environment
- TypeScript support: Out of the box

**Testing Scope**:
- Services (GifsService business logic)
- Components (rendering and interaction)
- Mappers (data transformation)

### End-to-End Testing

```bash
ng e2e
```

**Note**: Angular CLI doesn't include an e2e testing framework by default. Install one as needed:
- Cypress
- Playwright
- WebdriverIO

### Code Quality

**Formatter**: Prettier v3.8.1

Format code:

```bash
npx prettier --write .
```

---

## Environment Configuration

### Environment File

**Location**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: true,
  companyName: 'Gifs',
  companyName2: 'App',
  companySlogan: 'Maneja tus Gifs',
  
  // Giphy API Configuration
  giphyApiKey: 'yN3bxtwFlxajAW1DU4k1FiBBhlgqCrpZ',
  giphyUrl: 'https://api.giphy.com/v1',
};
```

### Key Configuration Values

| Variable | Value | Purpose |
|----------|-------|---------|
| `production` | true | Build optimization flag |
| `giphyApiKey` | API Key | Authentication for Giphy API |
| `giphyUrl` | https://api.giphy.com/v1 | Giphy API base URL |
| `companyName` | 'Gifs' | App branding |
| `companySlogan` | 'Maneja tus Gifs' | App tagline |

**⚠️ Security Note**: API key is exposed in the frontend code. In production, consider:
- Backend proxy for API calls
- Environment-specific API keys
- Rate limiting and monitoring

---

## Key Learning Outcomes

This practice project demonstrates:

✅ **Angular Fundamentals**
- Component-based architecture
- Standalone components
- Lazy loading with dynamic imports

✅ **State Management**
- Angular Signals for reactive state
- Computed properties for derived state
- Effects for side effects

✅ **Routing**
- Child routes and nested layouts
- Route parameters
- Redirect patterns

✅ **HTTP Communication**
- HttpClient for API integration
- RxJS operators (map, tap)
- Error handling patterns

✅ **Forms & User Input**
- Event binding and click handlers
- Two-way data binding

✅ **Styling**
- Tailwind CSS integration
- Component scoping

✅ **Best Practices**
- Service injection via constructor
- Separation of concerns
- Data persistence with localStorage

---

## Common Development Tasks

### Adding a New Page

1. Create component in `src/app/gifs/pages/`
2. Add route to `app.routes.ts`
3. Inject GifsService if needed
4. Implement template and logic

### Adding Search History to Menu

The `SideMenuOptions` component can display search history by iterating over `searchHistoryKeys`:

```typescript
export class SideMenuOptions {
  History = inject(GifsService);
  // Access via: this.History.searchHistoryKeys()
}
```

### Modifying API Parameters

Update `GifsService` methods for different Giphy endpoints or parameters:

```typescript
searchGifs(query: string) {
  return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
    params: {
      api_key: environment.giphyApiKey,
      limit: 20,  // Modify limit
      offset: 0,  // Add pagination
      q: query,
    },
  }).pipe(/*...*/);
}
```

---

## Troubleshooting

### Port Already in Use
```bash
ng serve --port 4201
```

### Cache Issues
```bash
rm -rf node_modules
npm install
```

### Build Errors
- Clear dist folder: `rm -rf dist/`
- Rebuild: `npm run build`

### API Errors
- Verify Giphy API key in environment file
- Check network connectivity
- Monitor browser console for CORS issues

---

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Giphy API Documentation](https://developers.giphy.com)
- [RxJS Documentation](https://rxjs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Last Updated**: September 11, 2026  
**Project Status**: Learning/Practice Project  
**Maintainer**: Srpotato25
