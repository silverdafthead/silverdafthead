
// Google AdMob Test Unit ID for Android Interstitial
// In a real React Native/Capacitor app, you would use this ID.
export const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

type AdEventListener = (isShown: boolean) => void;

class AdManager {
  private static instance: AdManager;
  private listeners: Set<AdEventListener> = new Set();
  
  // Configuration
  private readonly FREQUENCY_CAP = 3; // Show ad every 3 actions
  private triggerCount = 0;
  private isAdLoaded = false;
  private isAdShowing = false;
  private isLoading = false;

  private constructor() {
    // Automatically start pre-loading the first ad on initialization
    this.preloadAd();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Simulates the AdMob "Load" request.
   * In a real app, this calls MobileAds.load(...)
   */
  public preloadAd() {
    if (this.isAdLoaded || this.isLoading) return;

    console.log('[AdManager] Pre-loading background ad...');
    this.isLoading = true;

    // Simulate network delay (1.5s) for realism
    setTimeout(() => {
      this.isAdLoaded = true;
      this.isLoading = false;
      console.log('[AdManager] Ad Loaded and Ready.');
    }, 1500);
  }

  /**
   * Tracks a user action (e.g., screen change, button click).
   * If threshold is met, shows the ad.
   */
  public trackAction() {
    if (this.isAdShowing) return;

    this.triggerCount++;
    console.log(`[AdManager] Action tracked. Count: ${this.triggerCount}/${this.FREQUENCY_CAP}`);

    if (this.triggerCount >= this.FREQUENCY_CAP) {
      this.showInterstitial();
    }
  }

  /**
   * Attempts to show the Interstitial Ad.
   */
  private showInterstitial() {
    if (this.isAdLoaded) {
      console.log('[AdManager] Showing Interstitial Ad');
      this.isAdShowing = true;
      this.notifyListeners(true);
      
      // Reset counter
      this.triggerCount = 0;
      // Mark ad as consumed
      this.isAdLoaded = false; 
    } else {
      console.log('[AdManager] Ad not ready yet. Skipping...');
      // If ad wasn't ready, try loading again for next time
      this.preloadAd();
    }
  }

  /**
   * Called by the UI when the user closes the ad.
   */
  public dismissAd() {
    console.log('[AdManager] Ad Dismissed');
    this.isAdShowing = false;
    this.notifyListeners(false);
    
    // CRITICAL: Pre-load the NEXT ad immediately
    this.preloadAd();
  }

  public subscribe(listener: AdEventListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(isShown: boolean) {
    this.listeners.forEach(listener => listener(isShown));
  }
}

export const adManager = AdManager.getInstance();
