//
//  PTOpenCVUtils.cpp
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 3/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#include "PTOpenCVUtils.hpp"

using namespace cv;
using namespace std;

void test() {
}

void processVideoFrame(Mat &image, int &reps) {
  // Define the lower and upper boundaries of the "green"
  // ball in the HSV color space, then initialize the
  // list of tracked points
  int hsv_values[3]; hsv_values[0] = 55, hsv_values[1] = 130, hsv_values[2] = 175;
  int offset1 = 30, offset2 = 100;
  Scalar greenLower = Scalar(hsv_values[0]-offset1, hsv_values[1]-offset1, hsv_values[2]-offset2);
  Scalar greenUpper = Scalar(hsv_values[0]+offset1, hsv_values[1]+offset1, hsv_values[2]+offset2);

  Mat hsv = Mat::zeros( image.size(), CV_8UC1 );
  // Convert image to the HSV color space
  cvtColor(image, hsv, COLOR_BGR2HSV);

  // Construct a mask for the color "green", then perform
  // a series of dilations and erosions to remove any small
  // blobs left in the mask
  Mat thresholdedImage = Mat::zeros( image.size(), CV_8UC1 );

  inRange(hsv, greenLower, greenUpper, thresholdedImage);

  // Morphological operations
  IplConvKernel *se21 = cvCreateStructuringElementEx(21, 21, 10, 10, CV_SHAPE_RECT, NULL);
  IplConvKernel *se11 = cvCreateStructuringElementEx(11, 11, 5,  5,  CV_SHAPE_RECT, NULL);
  //cvClose(thresholdedImage, thresholdedImage, se21);
  // morphologyEx(thresholdedImage, thresholdedImage, MORPH_CLOSE, se21, Point(-1,-1), 1, 1, morphologyDefaultBorderValue() );
  //cvOpen(thresholdedImage, mask, se11);
  cvReleaseStructuringElement(&se21);
  cvReleaseStructuringElement(&se11);

  // Copy mask into a grayscale image
  Mat hough_in = Mat::zeros( image.size(), CV_8UC1 );
  thresholdedImage.copyTo(hough_in);
  GaussianBlur(hough_in, hough_in, Size(15, 15), 0, 0);

  // Convert cv::Mat to IplImage
  IplImage *ipl_img = new IplImage(hough_in);
  IplImage *ipl_image = new IplImage(image);

  // Run the Hough function
  CvMemStorage *storage = cvCreateMemStorage(0);
  CvSeq *circles = cvHoughCircles(ipl_img, storage, CV_HOUGH_GRADIENT, 4, image.rows/10, 100, 40, 1);

  // Find biggest circle
  int largestCircleRadius = 0, largestCircleRadiusIndex = 0;
  for (int i = 0; i < circles->total; i++) {
    float *p = (float*)cvGetSeqElem(circles, i);
    CvPoint center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    CvScalar val = cvGet2D(ipl_img, center.y, center.x);

    if (val.val[0] > largestCircleRadius) {
      largestCircleRadius = val.val[0];
      largestCircleRadiusIndex = i;
    }
  }

  // Draw circle
  if (circles -> total > 0 && largestCircleRadius >= 10) {
    float *p = (float*)cvGetSeqElem(circles, largestCircleRadiusIndex);
    CvPoint center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    cvCircle(ipl_image,  center, 3, CV_RGB(0,255,0), -1, CV_AA, 0);
    cvCircle(ipl_image,  center, cvRound(p[2]), CV_RGB(255,0,0),  3, CV_AA, 0);
    cvCircle(ipl_img, center, 3, CV_RGB(0,255,0), -1, CV_AA, 0);
    cvCircle(ipl_img, center, cvRound(p[2]), CV_RGB(255,0,0), 3, CV_AA, 0);
  }

  cvReleaseMemStorage(&storage);

  // Add text for displaying counts
  char msg[20];
  sprintf (msg, "Reps: %d", reps);
  cv::putText(image, msg,
              Point2f(50, 50),
              FONT_HERSHEY_SIMPLEX, 1, Scalar(255, 255, 255), 1);

  image = cv::cvarrToMat(ipl_image);
}
