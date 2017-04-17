//
//  CameraView.h
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/16/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifdef __cplusplus
#import <opencv2/videoio/cap_ios.h>
#import <opencv2/opencv.hpp>
#import <opencv2/core.hpp>
#import "PTOpenCVUtils.hpp"
#endif

#ifndef __IPHONE_4_0
#warning "This project uses features only available in iOS SDK 4.0 and later"
#endif

#ifdef __OBJC__
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <React/RCTView.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <Availability.h>
#define CV_CAMERA_FPS 20
#endif

@interface CameraView : RCTView <CvVideoCameraDelegate, RCTBridgeModule>

// OpenCV-related properties
@property (nonatomic, retain) UIImageView *imageView;
@property (nonatomic, retain) CvVideoCamera* videoCamera;

// Other UI properties
@property (strong, nonatomic) UIButton *quitButton;
@property (strong, nonatomic) UIButton *saveButton;
@property (strong, nonatomic) UIButton *resetButton;

@end
