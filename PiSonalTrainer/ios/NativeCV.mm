//
//  NativeCV.mm
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "NativeCV.h"

@implementation NativeCV

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (CameraView *)view
{
  CameraView *cameraView = [[CameraView alloc] init];
  self.cameraView = cameraView;
  return cameraView;
}

@end
