//
//  NativeCV.mm
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>

#import "NativeCV.h"
#import "OpenCVWrapper.h"

@implementation NativeCV

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(cv_basicTest:(NSString *)input)
{
  RCTLog(@"Basic Test: Entry: %@", input);
}

RCT_EXPORT_METHOD(cv_callbackTest)
{
  RCTLog(@"Callback Test: Entry");
}

RCT_EXPORT_METHOD(cv_startCamera)
{
  RCTLog(@"Starting Camera: Entry");
}

RCT_EXPORT_METHOD(cv_stopCamera)
{
  RCTLog(@"Stopping Camera: Entry");
}

@end
