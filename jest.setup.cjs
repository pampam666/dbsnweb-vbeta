require('@testing-library/jest-dom')

jest.mock('./src/lib/api/sanity/image', () => {
  try {
    const state = expect.getState()
    if (state.testPath && state.testPath.includes('image.test')) {
      return jest.requireActual('./src/lib/api/sanity/image')
    }
  } catch (e) {
    // expect.getState is not yet defined during early init
  }

  return {
    getOptimizedImageUrl: jest.fn(() => 'https://mocked-sanity-image.url'),
    urlForImage: jest.fn(() => ({
      image: jest.fn().mockReturnThis(),
      width: jest.fn().mockReturnThis(),
      height: jest.fn().mockReturnThis(),
      quality: jest.fn().mockReturnThis(),
      auto: jest.fn().mockReturnThis(),
      url: jest.fn(() => 'https://mocked-sanity-image.url'),
    })),
    sanityImageLoader: jest.fn(() => 'https://mocked-sanity-image.url'),
  }
})

