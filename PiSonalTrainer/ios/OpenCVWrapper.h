//
//  OpenCVWrapper.h
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 2/14/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef OpenCVWrapper_h
#define OpenCVWrapper_h

#import <opencv2/core.hpp>

#endif /* OpenCVWrapper_h */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface OpenCVWrapper : NSObject

+ (void) basicTest;
+ (NSString *) callbackTest;
+ (void) startCamera;
+ (void) stopCamera;

@end
