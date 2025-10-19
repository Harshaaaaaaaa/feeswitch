import sdk from '@farcaster/frame-sdk';

export const initFarcasterSDK = async () => {
  try {
    const context = await sdk.context;
    console.log('Farcaster context:', context);
    return context;
  } catch {
    console.log('Not running in Farcaster mini app context');
    return null;
  }
};

export const isFarcasterMiniApp = () => {
  return typeof window !== 'undefined' && window.parent !== window;
};

export { sdk };
