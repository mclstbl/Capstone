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
  #ifdef __cplusplus
  bool up;
  bool down;
  bool stay;
  CvPoint prev, cur;
  CvPoint first, last;
  double distance;
  #endif
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
    self.videoCamera.defaultFPS = CV_CAMERA_FPS;
    
    // Initialize rep count to zero
    reps = 0;
    // Initialize directions
    up = false;
    down = false;
    stay = false;
    // Init
    prev = CvPoint(-1, -1);
    cur = CvPoint(-1, -1);
    distance = -1;
    first = CvPoint(-1,-1);
    last = CvPoint(-1,-1);
    
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

/*
Do OpenCV image processing here! processImage gets called by the delegate for each frame.
*/
- (void)processImage:(Mat&)image;
{
#ifdef __cplusplus
  // Call functions defined in PTOpenCVUtils
  // stay is true when object pauses or object moves off view
  if (stay) {
    stay = false;
  }
  processVideoFrame(image, reps, up, down, stay, prev, cur, first, last, distance);
#endif
}

#pragma mark - UI Actions
/*
This is called by the react-native side in order to navigate out of this native view.
*/
RCT_EXPORT_METHOD(quit:(RCTResponseSenderBlock)callback)
{
  // Only return the reps count.This can be changed to an NSDictionary with other values.
  // FIXME: Return reps and sets NSDictionary
  NSNumber *_reps = [NSNumber numberWithInt:reps];
  callback(@[[NSNull null], _reps]);
}
/*
This function resets values but doesn't exit the native view.
*/
RCT_EXPORT_METHOD(reset)
{
  reps = 0;
  // TODO: add sets reset here, and other things that need to be reset
}

@end
