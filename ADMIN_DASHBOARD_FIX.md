# Admin Dashboard Fix - Companies Verification

## ✅ **Fixed Issues:**

### **Problem:**
Admin dashboard mein companies verify karne ke liye companies nahi aa rahi thi.

### **Root Cause:**
1. Companies fetch karne ke liye API call sahi se nahi ho raha tha
2. `apiRequest` function use ho raha tha jo exist nahi karta
3. Company type definition API response se match nahi kar raha tha

### **Changes Made:**

#### 1. **Fixed Companies Fetching** (`AdminDashboard.tsx`)
```typescript
// Before:
const { data: companies = [], isLoading: companiesLoading } = useQuery<Company[]>({
  queryKey: ['/api/admin/companies'],
});

// After:
const { data: companies = [], isLoading: companiesLoading } = useQuery<Company[]>({
  queryKey: ['admin_companies'],
  queryFn: async () => {
    const result = await api.getAllCompanies();
    return result.companies || [];
  },
});
```

#### 2. **Fixed Pickups Fetching**
```typescript
// Before:
const { data: pickups = [], isLoading: pickupsLoading } = useQuery<PickupRequest[]>({
  queryKey: ['/api/pickups'],
});

// After:
const { data: pickups = [], isLoading: pickupsLoading } = useQuery<PickupRequest[]>({
  queryKey: ['admin_pickups'],
  queryFn: async () => {
    const result = await api.getAllPickups();
    return result.pickups || [];
  },
});
```

#### 3. **Fixed Company Verification Mutation**
```typescript
// Before:
const verifyCompanyMutation = useMutation({
  mutationFn: async ({ id, verified }: { id: number; verified: boolean }) => {
    const res = await apiRequest("PATCH", `/api/admin/companies/${id}/verify`, { verified });
    return await res.json();
  },
});

// After:
const verifyCompanyMutation = useMutation({
  mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
    if (verified) {
      return await api.verifyCompany(id);
    } else {
      return await api.rejectCompany(id);
    }
  },
});
```

#### 4. **Updated Company Type Definition**
```typescript
// Before:
type Company = {
  id: number;
  email: string;
  companyName: string;
  registrationNumber: string;
  verified: boolean;
};

// After:
type Company = {
  id: string;
  email: string;
  name: string;
  company_name: string;
  registration_number: string;
  verified: boolean;
  created_at?: string;
};
```

### **API Endpoints Used:**

#### **Flask Backend (Authentication):**
- `GET /api/admin/companies` - Get all companies
- `GET /api/admin/companies/pending` - Get pending companies
- `POST /api/admin/companies/verify` - Verify company
- `POST /api/admin/companies/reject` - Reject company

#### **FastAPI Backend (Pickups):**
- `GET /api/pickups` - Get all pickups

### **🧪 Test It:**

1. **Login as Admin:**
   - Admin ID: `admin_001`
   - Password: `admin123`

2. **Go to Admin Dashboard**

3. **Check Companies Tab:**
   - Should see all registered companies
   - Can verify or reject companies
   - Console will show fetched companies

4. **Check Pickups Tab:**
   - Should see all pickup requests

### **Expected Behavior:**

- ✅ Companies list loads correctly
- ✅ Can verify companies (approve button works)
- ✅ Can reject companies (reject button works)
- ✅ Pickups list loads correctly
- ✅ Console shows API responses for debugging

All admin dashboard functionality should now work properly!