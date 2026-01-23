# Code Quality Cleanup Checklist

## Status: ✅ Phase 1 Complete - Critical Files Cleaned

---

## Completed Cleanups

### ✅ 1. GlobalBiddingModal.js
**Changes Made:**
- ✅ Removed 9 console.log statements
- ✅ Replaced `var` with `const`
- ✅ Improved variable naming (`mainModel` → `isModalOpen`, `ModalNotification` → `modalRef`, `datas` → `userData`)
- ✅ Added JSDoc comments for all functions
- ✅ Used constants from appConstants.js
- ✅ Replaced `alert()` with `Alert.alert()`
- ✅ Added null checks for AsyncStorage data
- ✅ Improved function names (`closeModelBaseOnId` → `closeModalByParcelId`, `getParcelById` → `fetchParcelById`)

---

## Remaining High-Priority Cleanups

### 🔴 CRITICAL - Security Issues

#### helper.js (Lines 4-9)
**Issue:** Exposed/commented Google Maps API keys
**Action Required:**
```javascript
// REMOVE these lines completely:
// export const GOOGLE_MAPS_KEY = "OLD_KEY_1";
// export const GOOGLE_MAPS_KEY = "OLD_KEY_2";
// etc.

// Move to .env file:
GOOGLE_MAPS_KEY=your_key_here
```

#### Drawer/Left/index.js (Line 16, 20)
**Issue:** Logging sensitive user data and tokens
**Action Required:**
```javascript
// REMOVE:
console.log('user>>>', JSON.stringify(user, null, 2));
console.log('tokenAccess', tokenAccess);

// If needed for debugging, use:
if (__DEV__) {
  console.log('User logged in:', user?.email);
}
```

---

### 🟠 HIGH PRIORITY - Remove Console.logs

#### Files to Clean (50+ instances):

1. **src/screen/Tracking/index.js** (20+ console.log)
   - Lines 48, 87-91, 176, 183, 256, 266-268, 394
   - Remove all or wrap in `__DEV__` check

2. **src/utilities/http.js** (10+ console.log)
   - Lines 39, 83, 105, 153, 201, 211, 223, 245, 289
   - Use proper error logging service instead

3. **src/services/apicalls/auth.js** (Lines 17, 23)
   ```javascript
   // REMOVE:
   console.log("response in aut responseJson",responseJson.data);
   console.log("erreo chala"); // Also fix typo
   ```

4. **src/hooks/*.js** (useFileUpload, useTrips, useNotifications)
   - Replace `console.log/error` with proper error handling
   - Use error boundary or reporting service

5. **src/screen/Shared/Settings/index.js** (Lines 26, 34, 42, 55)
   - Remove TODO console.logs
   - Either implement or remove placeholder logs

---

### 🟡 MEDIUM PRIORITY - Remove Commented Code

#### 1. RatingModal.js
**Lines to Remove:**
- Line 9: `// console.log(...)`
- Lines 22-26: Commented function
- Lines 43, 46: Commented console.logs
- Lines 57-64: Commented StarRating component (or implement it)

**Action:**
```javascript
// Either implement the star rating feature properly or remove all references
```

#### 2. Drawer/Left/index.js (Lines 39-55)
**Remove:** Entire commented logout logic block

#### 3. Tracking/index.js
**Lines to Remove:**
- Line 29, 31: Commented imports
- Lines 189, 204, 206-207: Commented console.logs
- Lines 294: Commented debug statement
- Lines 344-365: Hardcoded debug markers (move to `__DEV__` block)
- Lines 401-407: Commented TouchableOpacity

#### 4. utilities/http.js (Lines 2, 18-24, 35-68)
**Remove:** All commented interceptor code

#### 5. utilities/helper.js (Lines 1, 4-9)
**Remove:** All commented config and old API keys

---

### 🟢 LOW PRIORITY - Naming Conventions

#### 1. Variable Naming Fixes

**src/screen/Tracking/index.js:**
```javascript
// Change:
const latitudePoints = ...
const longitudePoints = ...
const headingPoints = ...

// To:
const latitudeCoordinates = ...
const longitudeCoordinates = ...
const headingValues = ...
```

#### 2. Consistent Naming Pattern

**Throughout codebase:**
```javascript
// Instead of mixing:
userData, userJsonData, datas, data

// Use consistently:
userData (for parsed object)
userDataString (for JSON string)
```

#### 3. Use `const` instead of `var`

**Files to fix:**
- utilities/http.js (Line 3)
- Any file still using `var`

---

### 📝 Code Quality Improvements

#### 1. Add Magic Number Constants

**src/screen/Tracking/index.js:**
```javascript
// Add to top of file:
const LATITUDE_DELTA = 0.04; // Map zoom level
const ANIMATION_DURATION_MS = 7000; // Marker animation time
const LOCATION_UPDATE_INTERVAL_MS = 6000; // Location refresh rate

// Then use these constants instead of magic numbers
```

**src/screen/Shared/MyTrips/index.js:**
```javascript
const DEFAULT_TRUNCATE_LENGTH = 22;
const DETAIL_TRUNCATE_LENGTH = 30;
```

#### 2. Remove Unused Variables

**RatingModal.js:**
```javascript
// Remove unused state:
// const [rating, setRating] = useState(0); // Never updated
// const handleRating = () => { ... } // Never called
```

**Tracking/index.js:**
```javascript
// Remove unused state:
// const [code, setCode] = useState('');
// const [text, setText] = useState('Enter Code');
```

#### 3. Fix Prop Issues

**Notification/Notifications/index.js (Line 51):**
```javascript
// Fix:
language={"this.props.language"} // Wrong - string literal

// To:
language={language} // Pass actual prop
```

---

## Automated Cleanup Commands

### Remove all console.log (use with caution):
```bash
# Dry run first:
grep -r "console\.log" src/ --exclude-dir=node_modules

# For each file, manually review and remove or wrap in __DEV__
```

### Find all commented code:
```bash
grep -r "^[[:space:]]*//" src/ --include="*.js" | grep -v "^[[:space:]]*//.*TODO\|FIXME\|NOTE"
```

### Find all `var` usage:
```bash
grep -r "var " src/ --include="*.js"
```

---

## Recommended Approach

### Phase 1: Critical Security (IMMEDIATE)
1. ✅ Clean GlobalBiddingModal
2. ⏳ Remove exposed API keys in helper.js
3. ⏳ Remove sensitive data logging in Drawer

### Phase 2: Console.log Removal (THIS WEEK)
1. ⏳ Wrap development logs in `__DEV__` check
2. ⏳ Remove production console.logs
3. ⏳ Implement proper error logging service

### Phase 3: Dead Code (NEXT WEEK)
1. ⏳ Remove all commented code blocks
2. ⏳ Remove unused imports/variables
3. ⏳ Fix commented features (implement or delete)

### Phase 4: Code Quality (ONGOING)
1. ⏳ Fix naming conventions
2. ⏳ Add magic number constants
3. ⏳ Improve JSDoc comments
4. ⏳ Add PropTypes validation

---

## Testing After Cleanup

### Manual Testing Required:
- [ ] GlobalBiddingModal works for drivers
- [ ] Tracking screen functions correctly
- [ ] All navigation flows work
- [ ] No console errors in production build

### Automated Testing:
- [ ] ESLint passes with no errors
- [ ] No unused variables warnings
- [ ] Build succeeds for iOS and Android

---

## Notes

- **DO NOT** remove console.error for critical errors
- **DO** wrap development logs in `__DEV__` instead of removing
- **TEST** each file after cleanup before committing
- **DOCUMENT** any intentional console.logs with comments

---

## Progress Tracking

- ✅ GlobalBiddingModal.js (100%)
- ⏳ Remaining files (0%)

**Total Cleanup Progress:** 2% complete

---

**Next Action:** Remove API keys from helper.js and secure logging in Drawer/Left/index.js
