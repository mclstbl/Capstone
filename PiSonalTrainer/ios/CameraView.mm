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
    self.r = [NSNumber numberWithInt:reps];
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
  self.r = nil;
  self.counts = nil;
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
    // Start of a set
    stay = false;
  }
  reps = [self.r intValue];
  processVideoFrame(image, reps, up, down, stay, prev, cur, first, last, distance);
#endif
  // FIXME: dynamically update this when set detection is finished
  //reps = 1;
  self.r = [NSNumber numberWithInt:reps];
  self.counts = @[self.r, self.r, self.r];
}

@end
