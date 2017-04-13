//
//  PTOpenCVUtils.cpp
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 3/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#include "PTOpenCVUtils.hpp"

#define COLLECTEDSLOPES_AMT 5
#define MAX_VALID_SLOPE 4
#define N 3

using namespace cv;
using namespace std;

char DIR_DEBUG[20];
/*
Takes a deque of slopes and determines if the arc direction is downward.
*/
bool isNegativeArch(std::deque<float> slopes) {
  bool ret = true;
  long i;
  for (i = 1; i < slopes.size(); i++) {
    // Return if slope is too steep
    if (abs(slopes[i - 1]) > MAX_VALID_SLOPE || abs(slopes[i]) > MAX_VALID_SLOPE)
      return false;
    // Previous slope should be less than current to form an arc
    ret = ret && (slopes[i - 1] <= slopes[i]);
    if (! ret) return false;
  }
  return ret;
}

/*
 Takes a deque of slopes and determines if the arc direction is downward.
 */
bool isPositiveArch(std::deque<float> slopes) {
  bool ret = true;
  long i;
  for (i = 1; i < slopes.size(); i++) {
    // Return if slope is too steep
    if (abs(slopes[i - 1]) > MAX_VALID_SLOPE || abs(slopes[i]) > MAX_VALID_SLOPE)
      return false;
    // Previous slope should be greater than current to form an arc
    ret = ret && (slopes[i - 1] >= slopes[i]);
    if (! ret) return false;
  }
  return ret;
}

/*
Returns the slope between 2 (x,y) positions a and b
*/
float slope(CvPoint a, CvPoint b) {
  return float(b.y - a.y)/float(b.x - a.x);
}

/*
Returns distance between 2 CvPoints
*/
float dist(CvPoint a, CvPoint b) {
  return sqrt(pow((a.x - b.x), 2) + pow((a.y - b.y), 2));
}

/*
Detects direction of object movement based on slopes between
consecutive points, and also displacement along y-axis
*/
void detectDirection(CvPoint prev, CvPoint cur, bool &up, bool &down, int &reps, std::deque<float> &slopes, Mat &image) {
  float slopeVal = slope(prev, cur);

  up = false, down = false;
  
  if (!isnan(slopeVal) && abs(slopeVal) < MAX_VALID_SLOPE &&
      slopeVal != INFINITY && slopeVal != - INFINITY && slopeVal != 0) {
    char slope_debug[100];
    if (slopes.size() >= 1 && slopeVal != slopes[slopes.size() - 1])
      slopes.push_back(slopeVal);
    else if (slopes.size() == 0)
      slopes.push_back(slopeVal);
    // Debug slopeVal
    sprintf (slope_debug, "Slope %.2f slopes size %ld", slopeVal, slopes.size());
    cv::putText(image, slope_debug,
                Point2f(50, 250),
                FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  
    if (slopes.size() > COLLECTEDSLOPES_AMT) {
      if (isNegativeArch(slopes)) {
        down = true;
        sprintf(DIR_DEBUG, "DOWN");
      }
      else if (isPositiveArch(slopes)) {
        up = true;
        sprintf(DIR_DEBUG, "UP");
      }
  
      if (up && down) {
        reps += 1;
        up = false;
        down = false;
      }
      slopes.clear();
    }
  }
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
Get average of at most the last n tracked pts not equal to None
Used for checking if the marker moved over the last few pts
*/
/*
float ptsAverage(pts) {
  int nsum0 = 0
  int nsum1 = 0
  ctr = 1
  # If pts has less than n non-None entries, get the average of all entries
  for p in pts:
    if (p is None):
      continue
    else:
      nsum0 += p[0]
      nsum1 += p[1]
    if (ctr == n):
      break
    ctr += 1
  return (nsum0 / ctr, nsum1 / ctr)
}
*/
/*
Main method exported to CameraView
*/
void processVideoFrame(Mat &image, int &reps, std::deque<CvPoint> &pts, std::deque<float> &slopes, bool &up, bool &down, CvPoint &pt) {
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

  CvPoint center;
  // Find biggest circle
  int largestCircleRadius = 0, largestCircleRadiusIndex = 0;
  for (int i = 0; i < circles->total; i++) {
    float *p = (float*)cvGetSeqElem(circles, i);
    center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    CvScalar val = cvGet2D(ipl_img, center.y, center.x);

    if (val.val[0] > largestCircleRadius) {
      largestCircleRadius = val.val[0];
      largestCircleRadiusIndex = i;
    }
  }
  
  // Draw circle
  if (circles -> total > 0 && largestCircleRadius >= 15) {
    float *p = (float*)cvGetSeqElem(circles, largestCircleRadiusIndex);
    center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    cvCircle(ipl_image,  center, 3, CV_RGB(0,255,0), -1, CV_AA, 0);
    cvCircle(ipl_image,  center, cvRound(p[2]), CV_RGB(255,0,0),  3, CV_AA, 0);

    pt = center;
    
    // Maintain the size of pts
    if (pts.size() > COLLECTEDSLOPES_AMT)
      //pts.pop_front();
      pts.clear();
    // Only add position if it is not too close to previous point - this prevents random outlier points from getting in
    if (pts.size() > 0) {
        if (pts.back().x != center.x && pts.back().y != center.y) {
        pts.push_back(center);
      }
    }
    else
        pts.push_back(center);
  }
  cvReleaseMemStorage(&storage);
  
  // Debug pts
  char str2[100];
  if (pts.size() > 0) sprintf (str2, "PT %d %d with size %ld", pts.back().x, pts.back().y, pts.size());
  cv::putText(image, str2,
              Point2f(50, 100),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  
  // Detect direction to update slopes and reps
  char str3[100];
  if (pts.size() >= 2) {
    sprintf(str3, "DD PT1 %d %d PT2 %d %d", pts[pts.size() - 2].x, pts[pts.size() - 2].y, pts[pts.size() - 1].x, pts[pts.size() - 1].y);
    detectDirection(pts[pts.size() - 2], pts[pts.size() - 1], up, down, reps, slopes, image);
    cv::putText(image, str3,
                Point2f(50, 200),
                FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  }
  cv::putText(image, DIR_DEBUG,
              Point2f(50, 150),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  
  // Add text for displaying counts
  char msg[20];
  sprintf (msg, "Reps: %d", reps);
  cv::putText(image, msg,
              Point2f(50, 50),
              FONT_HERSHEY_SIMPLEX, 1, Scalar(255, 255, 255), 1);

  image = cv::cvarrToMat(ipl_image);
}
