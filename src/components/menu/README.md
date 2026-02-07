# Menu Components

Menu navigation components that wrap PrimeReact menu components with simplified APIs.

## Components

### Breadcrumbs

Breadcrumb navigation component for showing the current page location.

```tsx
import { Breadcrumbs } from '@/components/menu';

<Breadcrumbs
  items={[
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Details' },
  ]}
  home={{ icon: 'pi pi-home', url: '/' }}
/>;
```

**Props:**

- `items` - Array of MenuItem objects representing the breadcrumb trail
- `home` - Optional home MenuItem (appears before items)
- `containerClassName` - Additional CSS classes for the container div
- All other PrimeReact BreadCrumb props

### TabMenu

Tab-based navigation menu component.

```tsx
import { TabMenu } from '@/components/menu';

const [activeIndex, setActiveIndex] = useState(0);

<TabMenu
  items={[
    { label: 'Dashboard', icon: 'pi pi-home' },
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Settings', icon: 'pi pi-cog' },
  ]}
  activeIndex={activeIndex}
  onTabChange={(e) => setActiveIndex(e.index)}
/>;
```

**Props:**

- `items` - Array of MenuItem objects representing the tabs
- `activeIndex` - Index of the active tab
- `onTabChange` - Callback when tab changes
- `containerClassName` - Additional CSS classes for the container div
- All other PrimeReact TabMenu props

## Usage

```tsx
import { Breadcrumbs, TabMenu } from '@/components/menu';
```

## Features

- ✅ Simplified API with array-based configuration
- ✅ Full TypeScript support
- ✅ Container className customization
- ✅ Access to all underlying PrimeReact props
- ✅ Dark mode compatible
- ✅ Consistent with other component patterns
