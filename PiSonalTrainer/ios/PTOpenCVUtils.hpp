//
//  PTOpenCVUtils.hpp
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 3/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef PTOpenCVUtils_hpp
#define PTOpenCVUtils_hpp

#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/opencv.hpp>
#include <opencv2/core.hpp>

using namespace cv;

void test();
void processVideoFrame(Mat &image, int &reps);

#endif /* PTOpenCVUtils_hpp */
