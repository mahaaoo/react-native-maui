/* eslint-disable no-undef */

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it('Icon E2E-TEST', async () => {
    await element(by.id('Navigate-Button-Icon')).tap();
    await expect(element(by.id('MAUI-ICON-ID')).atIndex(0)).toBeVisible();
    await element(by.text('Back')).tap();
  });

  it('Button E2E-TEST', async () => {
    await element(by.id('Navigate-Button-Button')).tap();

    await expect(
      element(by.id('MAUI-BASE-BUTTON-ID')).atIndex(0)
    ).toBeVisible();
    await element(by.id('MAUI-BASE-BUTTON-ID')).atIndex(0).tap();

    await expect(element(by.id('MAUI-GRADIENT-BUTTON-ID'))).toBeVisible();
    await element(by.id('MAUI-GRADIENT-BUTTON-ID')).atIndex(0).tap();

    await element(by.text('Back')).tap();
  });

  it('Badge E2E-TEST', async () => {
    await element(by.id('Navigate-Button-Badge')).tap();
    await expect(element(by.id('MAUI-BADGE-ID')).atIndex(0)).toBeVisible();
    await element(by.text('Back')).tap();
  });

  it('Divider E2E-TEST', async () => {
    await element(by.id('Navigate-Button-Divider')).tap();
    await expect(element(by.id('MAUI-DIVIDER-ID')).atIndex(0)).toBeVisible();
    await element(by.text('Back')).tap();
  });

  it('Swiper E2E-TEST', async () => {
    // EXAMPLE-FLAT-LIST
    await element(by.id('EXAMPLE-FLAT-LIST')).swipe(
      'up',
      'fast',
      NaN,
      NaN,
      0.8
    ); // set starting point X

    await element(by.id('Navigate-Button-Swiper')).tap();

    await expect(element(by.id('MAUI-SWIPER-ID')).atIndex(0)).toBeVisible();

    await element(by.text('Next')).tap();
    await element(by.text('Next')).tap();
    await element(by.id('MAUI-SWIPER-ID'))
      .atIndex(0)
      .swipe('left', 'fast', NaN, 0.8); // set starting point X
    await element(by.id('MAUI-SWIPER-ID'))
      .atIndex(0)
      .swipe('left', 'fast', NaN, 0.8); // set starting point X

    await element(by.text('Pre')).tap();
    await element(by.text('Pre')).tap();

    await element(by.text('Back')).tap();
  });
});
