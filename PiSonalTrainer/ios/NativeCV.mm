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

#pragma mark - UI Actions
/*
This is called by the react-native side in order to navigate out of this native view.
*/
RCT_EXPORT_METHOD(quit:(RCTResponseSenderBlock)callback)
{
  // Return array of reps in a session
  // The length of array equals the number of sets
  callback(@[[NSNull null], self.cameraView.counts]);
}
/*
This function resets values but doesn't exit the native view.
FIXME: doesn't work so not included 
*/
RCT_EXPORT_METHOD(reset:(RCTResponseSenderBlock)callback)
{
  self.cameraView.r = [NSNumber numberWithInt:0];
  self.cameraView.counts = @[];
  callback(@[[NSNull null], self.cameraView.counts]);
}

@end
