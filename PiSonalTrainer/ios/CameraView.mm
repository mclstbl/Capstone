//
//  CameraView.m
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/16/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CameraView.h"

using namespace cv;

@implementation CameraView{
  int reps;
}

RCT_EXPORT_MODULE();

- (instancetype)init
{
  // Get screen dimensions
  CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
  CGFloat screenWidth = [[UIScreen mainScreen] bounds].size.width;
  if (screenWidth > screenHeight) {
    CGFloat tempHeight = screenWidth;
    screenWidth = screenHeight;
    screenHeight = tempHeight;
  }
  // Calculate button size info
  CGFloat buttonHeight = 70;
  if ((self = [super init])) {
    // Initialize imageView
    CGRect imageFrame = CGRectMake( 0, 0, screenWidth, screenHeight - buttonHeight);
    UIImageView *imageView = [[UIImageView alloc] initWithFrame: imageFrame];
    [self addSubview:imageView];
    self.imageView = imageView;
    
    // Set videoCamera attributes
    self.videoCamera = [[CvVideoCamera alloc] initWithParentView: self.imageView];
    self.videoCamera.delegate = self;
    self.videoCamera.defaultAVCaptureDevicePosition = AVCaptureDevicePositionFront;
    self.videoCamera.defaultAVCaptureSessionPreset = AVCaptureSessionPreset352x288;
    if ( [[UIDevice currentDevice] orientation] == UIInterfaceOrientationPortraitUpsideDown )
      self.videoCamera.defaultAVCaptureVideoOrientation = AVCaptureVideoOrientationPortraitUpsideDown;
    else
      self.videoCamera.defaultAVCaptureVideoOrientation = AVCaptureVideoOrientationPortrait;
    self.videoCamera.defaultFPS = 30;
    
    // [self.videoCamera adjustLayoutToInterfaceOrientation:UIInterfaceOrientationPortrait];
    
    // Initialize rep count to zero
    reps = 0;
    
    RCTLog(@"Starting camera from CameraView");
    [self.videoCamera start];
  }
  
  return self;
}

- (void) dealloc
{
  self.videoCamera = nil;
}

#pragma mark - Protocol CvVideoCameraDelegate

#ifdef __cplusplus
/*
Do image processing here! processImage gets called by the delegate for each frame.
*/
- (void)processImage:(Mat&)image;
{
  // Do some OpenCV stuff with the image
  // Call functions defined in PTOpenCVUtils
  processVideoFrame(image, reps);
}
#endif

#pragma mark - UI Actions
/*
This is called by the react-native side in order to navigate out of this native view.
*/
RCT_EXPORT_METHOD(quit:(RCTResponseSenderBlock)callback)
{
  // Only return the reps count.This can be changed to an NSDictionary with other values.
  NSNumber *_reps = [NSNumber numberWithInt:reps];
  callback(@[[NSNull null], _reps]);
}
/*
This function resets values but doesn't exit the native view.
*/
RCT_EXPORT_METHOD(reset)
{
  reps = 0;
}

@end
