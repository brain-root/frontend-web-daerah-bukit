# Dokumentasi Frontend Website Daerah Solok

## Daftar Isi

- [Pengenalan](#pengenalan)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Project](#struktur-project)
- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [Komponen Utama](#komponen-utama)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Autentikasi](#autentikasi)
- [Halaman Publik](#halaman-publik)
- [Dashboard Admin](#dashboard-admin)
- [UI Design System](#ui-design-system)
- [Hooks Custom](#hooks-custom)
- [Utils dan Helpers](#utils-dan-helpers)
- [Best Practices](#best-practices)
- [Optimasi Performa](#optimasi-performa)

## Pengenalan

Frontend Website Daerah Solok dibangun menggunakan React dengan TypeScript, menerapkan arsitektur modular dan komponen yang reusable. Aplikasi ini menyediakan antarmuka untuk berbagai fitur termasuk informasi wisata, direktori UMKM, forum diskusi, dan dashboard admin.

Tujuan utama dari frontend adalah menyediakan pengalaman pengguna yang menarik dan responsif, mengoptimalkan performa dan aksesibilitas, serta memberikan tampilan yang konsisten di berbagai perangkat.

## Teknologi yang Digunakan

1. **React** - Library JavaScript untuk membangun user interface
2. **TypeScript** - Superset JavaScript yang menambahkan static typing
3. **Vite** - Build tool yang cepat untuk development
4. **React Router** - Routing library untuk navigasi
5. **React Query (TanStack Query)** - Library untuk fetching, caching, dan state management data server
6. **Tailwind CSS** - Utility-first CSS framework
7. **Lucide Icons** - Library icon modern
8. **React Hook Form** - Library untuk pengelolaan form
9. **Zod** - TypeScript-first schema validation
10. **Sonner** - Library modern untuk toast notifications
11. **Axios** - HTTP client untuk API requests
12. **date-fns** - Library untuk manipulasi date/time

## Struktur Project

```
src/
├── components/        # Komponen Reusable UI
│   ├── admin/         # Komponen khusus admin
│   ├── auth/          # Komponen autentikasi
│   ├── common/        # Komponen umum (forms, buttons, dsb)
│   ├── contact/       # Komponen halaman kontak
│   ├── forum/         # Komponen fitur forum
│   ├── home/          # Komponen halaman beranda
│   ├── layout/        # Layout umum (Navbar, Footer, dsb)
│   └── ui/            # Komponen UI primitif
├── contexts/          # React Context Providers
├── hooks/             # Custom React Hooks
├── lib/               # Library utilities
├── pages/             # Halaman aplikasi
│   ├── admin/         # Halaman admin
│   ├── auth/          # Halaman autentikasi
│   └── forum/         # Halaman forum
├── services/          # Service untuk API calls
├── types/             # Type definitions
└── utils/             # Helper utilities
```

## Arsitektur Aplikasi

Website ini menggunakan arsitektur berbasis komponen dengan pendekatan "data down, actions up". Aplikasi ini juga mengadopsi beberapa prinsip dari Clean Architecture untuk memisahkan logika bisnis dari UI.

### Pattern Arsitektur

1. **Component-Based Architecture** - UI terbagi dalam komponen-komponen reusable
2. **Container-Presentational Pattern** - Pemisahan logika (container) dan UI (presentational)
3. **Context API & Custom Hooks** - Untuk state management dan sharing logika
4. **Service Layer** - Enkapsulasi API calls dan logika bisnis
5. **Type-Driven Development** - Menggunakan TypeScript untuk definisi tipe dan validasi

## Komponen Utama

### Layout Components

Layout components membentuk struktur dasar aplikasi:

1. **Layout** - Wrapper utama yang berisi Navbar dan Footer
2. **Navbar** - Navigasi utama dengan menu responsif dan auth state
3. **Footer** - Footer dengan links dan informasi kontak
4. **AdminLayout** - Layout khusus untuk halaman admin dengan sidebar

### Form Components

1. **FormInput** - Input field dengan validasi dan error handling
2. **FormTextarea** - Textarea dengan validasi
3. **FormSelect** - Dropdown select dengan validasi
4. **FormImageUpload** - Komponen upload gambar dengan preview
5. **RichTextEditor** - Editor teks sederhana untuk posting forum

### UI Components

1. **LoadingSpinner** - Indikator loading
2. **Pagination** - Navigasi halaman
3. **Tabs** - Komponen tab untuk switching content
4. **ErrorBoundary** - Menangkap error pada komponen child

### Feature-Specific Components

1. **TourismHighlights** - Menampilkan destinasi wisata unggulan
2. **BusinessHighlights** - Menampilkan UMKM unggulan
3. **EventsPreview** - Preview acara mendatang
4. **RecentThreads** - Menampilkan thread forum terbaru
5. **TourismForm** - Form untuk menambah/edit destinasi wisata
6. **BusinessModal** - Modal dialog untuk menambah/edit bisnis
7. **EventModal** - Modal dialog untuk menambah/edit acara

## Routing

Routing diimplementasikan menggunakan React Router v6 dengan struktur routing sebagai berikut:

### Public Routes

- `/` - Halaman beranda
- `/wisata` - Daftar destinasi wisata
- `/wisata/:id` - Detail destinasi wisata
- `/umkm` - Direktori UMKM
- `/umkm/:id` - Detail UMKM
- `/acara` - Daftar acara
- `/acara/:id` - Detail acara
- `/forum` - Forum diskusi
- `/forum/category/:categoryId` - Thread pada kategori tertentu
- `/forum/thread/:threadId` - Detail thread forum
- `/kontak` - Halaman kontak
- `/tentang` - Halaman tentang

### Auth Routes

- `/login` - Halaman login
- `/daftar` - Halaman registrasi
- `/profil` - Halaman profil pengguna
- `/lupa-password` - Reset password

### Admin Routes (Protected)

- `/admin` - Dashboard admin
- `/admin/wisata` - Manajemen destinasi wisata
- `/admin/umkm` - Manajemen UMKM
- `/admin/acara` - Manajemen acara
- `/admin/forum` - Moderasi forum
- `/admin/users` - Manajemen pengguna
- `/admin/settings` - Pengaturan admin

## State Management

### Global State

Aplikasi menggunakan kombinasi dari:

1. **React Context API** - Untuk state yang dibutuhkan di banyak komponen (AuthContext)
2. **React Query** - Untuk state yang berasal dari API

### AuthContext

AuthContext mengelola state autentikasi dan menyediakan:

- Data pengguna yang sedang login
- Login/Logout/Register methods
- Token refresh mechanism
- Proteksi rute

### React Query

React Query digunakan untuk:

- Fetching data dari API
- Caching data
- Otomatis refetching
- Mutasi data (create, update, delete)
- Pagination dan infinite loading

## API Integration

### API Client

Axios digunakan sebagai HTTP client dengan konfigurasi:

- Base URL dari environment variable
- Interceptors untuk handling token
- Auto token refresh ketika expired
- Error handling

### Service Layer

Services mengenkapsulasi semua API calls:

- `authService` - Autentikasi dan manajemen user
- `tourismService` - Destinasi wisata
- `businessService` - UMKM
- `eventService` - Acara
- `forumService` - Forum diskusi
- `moderationService` - Moderasi konten
- `userService` - Manajemen pengguna

## Autentikasi

### Flow Autentikasi

1. **Login/Register** - Mendapatkan access token dan refresh token
2. **Token Storage** - Token disimpan di localStorage
3. **Request Authentication** - Token ditambahkan ke header Authorization
4. **Token Refresh** - Auto refresh ketika token expired
5. **Logout** - Menghapus token dan invalidasi di server

### Proteksi Rute

Komponen `ProtectedRoute` dan `AdminRoute` memastikan hanya pengguna dengan role yang sesuai yang dapat mengakses halaman tertentu.

## Halaman Publik

### HomePage

Halaman beranda menampilkan:

- Hero section dengan gambar menarik
- Feature section menjelaskan layanan website
- Tourism highlights (Destinasi wisata populer)
- Business highlights (UMKM unggulan)
- Events preview (Acara mendatang)
- Newsletter section

### TourismPage & TourismDetailPage

- Daftar destinasi wisata dengan filter dan search
- Detail destinasi dengan galeri foto
- Informasi lokasi dan deskripsi

### BusinessDirectoryPage & BusinessDetailPage

- Direktori UMKM dengan filter kategori dan search
- Detail bisnis dengan informasi kontak
- Lokasi dan deskripsi

### EventsPage & EventDetailPage

- Daftar acara dan kegiatan dengan filtering
- Detail acara dengan tanggal, waktu, lokasi

### ForumPage & ThreadPage

- Kategori forum diskusi
- List thread per kategori
- Detail thread dengan balasan
- Form untuk membuat thread dan balasan

### AboutPage & ContactPage

- Informasi tentang Daerah Solok
- Form kontak untuk mengirim pesan

## Dashboard Admin

### AdminDashboardPage

- Statistik dan overview website
- Recent activities
- Quick links ke fitur manajemen

### AdminTourismPage

- CRUD destinasi wisata
- Upload dan manajemen gambar
- Toggle featured status

### AdminBusinessPage

- CRUD bisnis/UMKM
- Filter dan search bisnis
- Manajemen kategori

### AdminEventPage

- CRUD acara/kegiatan
- Pengaturan tanggal dan waktu acara

### AdminForumPage

- Moderasi forum
- Manajemen kategori forum
- Menangani laporan konten

### AdminUserPage

- Manajemen pengguna
- Assign/change roles
- Disable/enable accounts

## UI Design System

### Design System Components

1. **Typography** - Heading, body text, dan font styles
2. **Colors** - Color palette dengan primary, secondary, accent colors
3. **Spacing** - Consistent spacing system
4. **Buttons** - Various button styles (primary, secondary, outline)
5. **Cards** - Container untuk displaying content
6. **Forms** - Form inputs dengan styling konsisten

### Tailwind Configuration

Tailwind dikonfigurasi dengan:

- Custom colors untuk branding
- Extended spacing dan typography
- Custom components (buttons, cards, forms)
- Dark mode configuration

## Hooks Custom

### Data Fetching Hooks

1. **useTourism** - Hook untuk fetching dan manipulasi data destinasi wisata
2. **useBusiness** - Hook untuk fetching dan manipulasi data UMKM
3. **useEvents** - Hook untuk fetching dan manipulasi data acara
4. **useForum** - Hook untuk fetching dan manipulasi data forum
5. **useUser** - Hook untuk fetching dan manipulasi data pengguna

### Form Hooks

1. **useFormSubmit** - Hook untuk handling form submission dengan loading dan error states
2. **useImageUpload** - Hook untuk upload dan preview gambar

### Utility Hooks

1. **useDebounce** - Debouncing values (search inputs)
2. **useLocalStorage** - Persistent state di localStorage
3. **usePagination** - Logic untuk pagination

## Utils dan Helpers

### API Utilities

- `api.ts` - Axios instance dan interceptors
- `react-query.ts` - Query client dan query keys

### Formatters

- Date formatters (formatDate, formatDateTime)
- Number formatters (formatCurrency, formatNumber)
- Text formatters (truncateText, capitalizeFirst)

### Validators

- Form validation schemas (Zod)
- Input validators

## Best Practices

### Performance

- Lazy loading untuk routes
- Memoization dengan useMemo dan useCallback
- Image optimization
- Code splitting

### Security

- Input sanitization
- XSS prevention
- CSRF protection
- Secure authentication flow

### Accessibility

- ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Proper heading hierarchy

### SEO

- Semantic HTML
- Meta tags
- Open Graph tags
- Structured data

## Optimasi Performa

### Lazy Loading

Routes dimuat secara lazy loading untuk mengurangi initial bundle size:

```jsx
const TourismPage = React.lazy(() => import("./pages/TourismPage"));
```

### Caching Strategy

React Query digunakan dengan strategi caching yang optimal:

- `staleTime` - Berapa lama data dianggap fresh
- `cacheTime` - Berapa lama data disimpan di cache
- `refetchOnWindowFocus` - Auto refetch ketika window mendapat focus
- `refetchOnReconnect` - Auto refetch ketika device kembali online

### Image Optimization

- Lazy loading gambar
- Responsive images dengan srcset
- WebP format dengan fallbacks
