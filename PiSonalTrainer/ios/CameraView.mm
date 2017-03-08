//
//  CameraView.m
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/16/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CameraView.h"

using namespace cv;

@implementation CameraView

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
  
  if ((self = [super init])) {
    // Initialize imageView - uncomment other lines to load me.jpg
    CGRect imageFrame = CGRectMake( 0, 40, screenWidth, screenHeight);
    // UIImage* img = [UIImage imageNamed:@"me.jpg"];
    UIImageView *imageView = [[UIImageView alloc] initWithFrame: imageFrame];
    //imageView.image = img;
    [self addSubview:imageView];
    self.imageView = imageView;
    
    // Set videoCamera attributes
    self.videoCamera = [[CvVideoCamera alloc] initWithParentView: self.imageView];
    self.videoCamera.delegate = self;
    self.videoCamera.defaultAVCaptureDevicePosition = AVCaptureDevicePositionFront;
    self.videoCamera.defaultAVCaptureSessionPreset = AVCaptureSessionPreset352x288;
    self.videoCamera.defaultAVCaptureVideoOrientation = AVCaptureVideoOrientationPortrait;
    self.videoCamera.defaultFPS = 30;
    
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
Do image processing here! I think processImage gets called by the delegate for each frame.
*/
- (void)processImage:(Mat&)image;
{
  // Do some OpenCV stuff with the image
  
  // VideoFaceDetector
  NSString *path = [[NSBundle mainBundle] pathForResource:@"haarcascade_frontalface_default.xml" ofType:nil];
  std::string CASCADE_FILE = std::string([path UTF8String]);
  
  VideoFaceDetector detector(CASCADE_FILE);
  cv::Point a = detector.getFrameAndDetect(image);
  
  if (detector.isFaceFound())
  {
    cv::rectangle(image, detector.face(), cv::Scalar(255, 0, 0));
    cv::circle(image, detector.facePosition(), 30, cv::Scalar(0, 255, 0));
  }
}
#endif

#pragma mark - UI Actions
@end
