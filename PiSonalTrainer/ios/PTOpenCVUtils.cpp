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

char DIR_DEBUG[20];

/*
Returns distance between 2 CvPoints
*/
double dist(CvPoint a, CvPoint b) {
  return sqrt(pow((a.x - b.x), 2) + pow((a.y - b.y), 2));
}
/*
# Detect end of a set if object stays in roughly the same position for more than 10 seconds
# stop0 is the time when the object first stopped
# t0 is the current time
def detectEndOfSet(stop0, t0, sets, reps):
if ((t0 - stop0) >= 5 and reps > 0):
print ("reset reps")
sets += 1
print ("incremented sets to " + str(sets))
stop0 = -1
reps = 0
return (stop0, sets, reps)
*/
/*
Define the lower and upper boundaries of the "green" ball in the HSV color space, then initialize the list of tracked points
*/
void defineColour(Scalar &greenLower, Scalar &greenUpper) {
  int hsv_values[3]; hsv_values[0] = 55, hsv_values[1] = 130, hsv_values[2] = 175;
  int offset1 = 30, offset2 = 100;
  greenLower = Scalar(hsv_values[0]-offset1, hsv_values[1]-offset1, hsv_values[2]-offset2);
  greenUpper = Scalar(hsv_values[0]+offset1, hsv_values[1]+offset1, hsv_values[2]+offset2);
}
/*
Find green objects in view
*/
void findGreenObject(Mat image, Mat &tmp, Scalar greenLower, Scalar greenUpper) {
  cvtColor(image, tmp, COLOR_BGR2HSV);

  // Construct a mask for the color "green"
  inRange(tmp, greenLower, greenUpper, tmp);

  // Copy mask into a grayscale image and blur
  GaussianBlur(tmp, tmp, Size(15, 15), 0, 0);
}
/*
Resets point markers to initial state
*/
void resetPointers(CvPoint &first, CvPoint &last, CvPoint &prev, CvPoint &cur) {
  first = CvPoint(-1, -1);
  last = CvPoint(-1, -1);
  prev = CvPoint(-1, -1);
  cur = CvPoint(-1, -1);
}
/*
Main method exported to CameraView
*/
void processVideoFrame(Mat &image, int &reps, bool &up, bool &down, bool &stay, CvPoint &prev, CvPoint &cur, CvPoint &first, CvPoint &last, double &distance) {

  // Debugging string to be reused
  char debug[100];

  Scalar greenLower, greenUpper;
  defineColour(greenLower, greenUpper);

  Mat tmp = Mat::zeros( image.size(), CV_8UC1 );
  findGreenObject(image, tmp, greenLower, greenUpper);

  // Find circle contours using Hough method
  IplImage *hough_in_img = new IplImage(tmp);
  CvMemStorage *storage = cvCreateMemStorage(0);
  CvPoint center;

  // FIXME: This is from the C API - try not to mix with C++
  double dp = 4;
  double min_dist = image.rows / 10;
  double p1 = 100, p2 = 40;
  int min_radius = 1;
  CvSeq *circles = cvHoughCircles(hough_in_img, storage, CV_HOUGH_GRADIENT, dp, min_dist, p1, p2, min_radius);

  // Find biggest circle
  int largestCircleRadius = 0, largestCircleRadiusIndex = 0;
  for (int i = 0; i < circles->total; i++) {
    float *p = (float*)cvGetSeqElem(circles, i);
    center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    CvScalar val = cvGet2D(hough_in_img, center.y, center.x);

    if (val.val[0] > largestCircleRadius) {
      largestCircleRadius = val.val[0];
      largestCircleRadiusIndex = i;
    }
  }
  
  char up_debug[100], down_debug[100];
  if (up) {
    sprintf(up_debug, "UP");
  }
  else sprintf(up_debug, " ");
  if (down) {
    sprintf(down_debug, "DOWN");
  }
  else sprintf(down_debug, " ");
  cv::putText(image, up_debug,
              Point2f(50, 225),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 0, 0), 1);
  cv::putText(image, down_debug,
              Point2f(50, 250),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 0, 0), 1);

  IplImage *image_img = new IplImage(image);
  
  // This is executed when the object pauses (assume that means either up or down movement) or disappears from view
  // Pause or leave view at top or bottom to trigger arc detection
  if (
      // Object pauses or lingers in the same area
      (abs(center.x - prev.x) < PAUSE_OFFSET && abs(center.y - prev.y) < PAUSE_OFFSET)
      // OR Object goes offscreen
      || (center.x == 0 && center.y == 0 && prev.x > 0 && prev.y > 0)
      // OR enough points have been tracked to form half of a rep
      || distance >= MIN_ARCLENGTH
      ) {
    stay = true;
    
    // Update value of last point
    if (center.x > 0 && center.y > 0)
      last = center;
    
    // Determine up/down - (0,0) is top left in any orientation
    if (last.y < first.y && distance > MIN_ARCLENGTH && last.y > 0 && first.y > 0 && !up ) {
      up = true;
      distance = -1;
      resetPointers(first, last, prev, cur);
    }
    else if (last.y > first.y && distance > MIN_ARCLENGTH && last.y > 0 && first.y > 0 && !down) {
      down = true;
      distance = -1;
      resetPointers(first, last, prev, cur);
    }
    
    // Increment reps and reset directions
    if (up && down) {
      reps ++;
      up = false;
      down = false;
      distance = -1;
      resetPointers(first, last, prev, cur);
    }
    // Ignore down if up was not detected prior
    else if (!up && down) {
      down = false;
      distance = -1;
      resetPointers(first, last, prev, cur);
    }
    // Ignore incomplete up/down and restart building path
    else if (!up && !down){
      distance = -1;
      first = CvPoint(-1, -1);
    }
    // Reset everything if waiting for down, but down has not happened after a while
    else if (distance > MAX_ARCLENGTH && up && !down){
      up = false;
      down = false;
      distance = -1;
      resetPointers(first, last, prev, cur);
    }
    
    sprintf(up_debug, " ");
    sprintf(down_debug, " ");
  }
  // Keep tracking path points if they meet criteria but length is not enough
  else if (
      // Circle with valid size is found and largest one is visible on screen
      circles -> total > 0 && largestCircleRadius >= MIN_CIRCLE_RADIUS && center.x != 0 && center.y != 0
      // Path is not long enough yet OR this is the first detected point
      && (dist(prev, center) < MAX_PT_DIST || (prev.x < 0 && prev.y < 0))
      // No duplicates
      && center.x != prev.x && center.y != prev.y) {

    // Add largest circle center to pts
    float *p = (float*)cvGetSeqElem(circles, largestCircleRadiusIndex);
    center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    // Draw circles to identify object on screen
    cvCircle(image_img, center, 3, CV_RGB(0,255,0), -1, CV_AA, 0);
    cvCircle(image_img, center, cvRound(p[2]), CV_RGB(255,0,0), 3, CV_AA, 0);
    
    // Keep a reference to first point to determine direction later
    if (distance == -1 && first.x == -1 && first.y == -1) {
      first = center;
    }
    // Otherwise update current latest point
    // FIXME: remove cur?
    else {
      last = center;
      cur = center;
    }
    // Update distance
    distance = dist(first, center);
  }
  cvReleaseMemStorage(&storage);
  sprintf(debug, "Position: %d %d", center.x, center.y);
  cv::putText(image, debug,
              Point2f(50, 125),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(0, 0, 0), 1);
  
  sprintf(debug, "Arclength: %lf", distance);
  cv::putText(image, debug,
              Point2f(50, 150),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(0, 0, 0), 1);
 
  // Add text for displaying counts
  char msg[20];
  sprintf (msg, "Reps: %d", reps);
  cv::putText(image, msg,
              Point2f(50, 50),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(0, 0, 0), 2);

  image = cv::cvarrToMat(image_img) + image;
  // For debugging: display path instead of image
  //image = path;
  // Done processing current point so assign it to prev
  prev = cur;
}
