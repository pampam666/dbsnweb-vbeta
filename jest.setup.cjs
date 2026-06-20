require('@testing-library/jest-dom')

const isImageTest = process.argv.some(arg => typeof arg === 'string' && arg.includes('image.test'))

if (!isImageTest) {
  jest.mock('./src/lib/api/sanity/image', () => ({
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
  }))
}
