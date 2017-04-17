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

#define MAX_DIST 100 // distance between consecutive points
#define MIN_PTS_DIST 150 // arclength
#define MIN_CIRCLE_RADIUS 252 // size of detected circle

using namespace cv;

double dist(CvPoint a, CvPoint b);

void processVideoFrame(Mat &image, Mat &path, int &reps, bool &up, bool &down, bool &stay, CvPoint &prev, CvPoint &cur, CvPoint &first, CvPoint &last, double &distance);

#endif /* PTOpenCVUtils_hpp */
