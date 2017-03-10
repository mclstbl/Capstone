//
//  NativeCV.h
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CameraView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface NativeCV : RCTViewManager <RCTBridgeModule>

@property (strong, nonatomic) CameraView *cameraView;

@end
