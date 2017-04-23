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
#include <cmath>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/opencv.hpp>
#include <opencv2/core.hpp>

#define MAX_PT_DIST 150 // distance between consecutive points
#define MIN_ARCLENGTH 80 // arclength
#define MAX_ARCLENGTH 200 // arclength
#define MIN_CIRCLE_RADIUS 200 // size of detected circle
#define PAUSE_OFFSET 30 // allowed distance between points to be considered a pause

using namespace cv;

double dist(CvPoint a, CvPoint b);

void processVideoFrame(Mat &image, int &reps, int sets, bool &up, bool &down, bool &stay, CvPoint &prev, CvPoint &cur, CvPoint &first, CvPoint &last, double &distance);

#endif /* PTOpenCVUtils_hpp */
