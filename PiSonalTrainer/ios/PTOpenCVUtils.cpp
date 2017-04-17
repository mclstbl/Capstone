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
Checks if the object has been in roughly the same position for more than n frames
*/
bool isPaused() {
// TODO: Implement this
  bool value = false;
  return value;
}
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
vector<Point> defineArc() {
  vector<Point> curvePoints;
  int radius = 100;
  for (int x = radius; x >= 14; x -= 1){
    int y = sqrt((radius * radius) - (x * x));
    Point new_point = Point(x, y);
    curvePoints.push_back(new_point);
  }
  return curvePoints;
}

/*
Main method exported to CameraView
*/
// TODO: separate this into smaller functions
void processVideoFrame(Mat &image, Mat &path, int &reps, bool &up, bool &down, bool &stay, CvPoint &prev, CvPoint &cur, CvPoint &first, CvPoint &last, double &distance) {

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
  
  //double distance;
  char up_debug[100], down_debug[100];
  if (up) {
    sprintf(up_debug, "UP");
  }
  else sprintf(up_debug, " ");
  if (down) {
    sprintf(down_debug, "DOWN");
  }
  else sprintf(down_debug, " ");
  cv::putText(path, up_debug,
              Point2f(50, 225),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 0, 0), 1);
  cv::putText(path, down_debug,
              Point2f(50, 250),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 0, 0), 1);
  cv::putText(image, up_debug,
              Point2f(50, 225),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 0, 0), 1);
  cv::putText(image, down_debug,
              Point2f(50, 250),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 0, 0), 1);

  // Connect lines to the collected path matrix if they meet criteria
  IplImage *image_img = new IplImage(image);
  if (circles -> total > 0 && largestCircleRadius >= MIN_CIRCLE_RADIUS && center.x != 0 && center.y != 0 && (dist(prev, center) < MAX_DIST || prev.x == 0 && prev.y == 0)
      //&& dist(first, center) < MIN_PTS_DIST
      && center.x != prev.x && center.y != prev.y) {

    // Add largest circle center to pts
    float *p = (float*)cvGetSeqElem(circles, largestCircleRadiusIndex);
    center = cvPoint(cvRound(p[0]),cvRound(p[1]));
    //pts.push_back(center);
    cur = center;

    // Draw circles to identify object on screen
    cvCircle(image_img, center, 3, CV_RGB(0,255,0), -1, CV_AA, 0);
    cvCircle(image_img, center, cvRound(p[2]), CV_RGB(255,0,0), 3, CV_AA, 0);
    
    // Save path to matrix by drawing a line
    if (prev.x != 0 && prev.y != 0) {
      line(path, prev, cur, Scalar(255, 0, 0), 1, 8);
    }

    // Keep a reference to first point to determine direction later
    //if ((prev.x == 0 && prev.y == 0 && reps == 0) || (!up && !down)) {
    if (!up && !down && distance == 0) {
      first = center;
    }
  }
  // This is executed when the object pauses (assume that means either up or down movement)
  // Pause at top or bottom to trigger arc detection
  else if ((center.x == prev.x && center.y == prev.y && distance > MIN_PTS_DIST) || (center.x == 0 && center.y == 0 && prev.x > 0 && prev.y > 0)) {
    // Force path matrix to clear
    stay = true;

    // Find contour to compare it with defined rep arc
    vector<vector<Point>> contours;
    vector<Vec4i> hierarchy;

    // The path matrix is a black/white image so no thresholding is needed here
    // Go straight to finding contours
    findContours(path, contours, RETR_TREE, CHAIN_APPROX_SIMPLE, Point(0,0));
    Scalar color = Scalar(255, 255, 255);
    drawContours(path, contours, 0, color, 2, 8, hierarchy, 0, Point());

    // Define quarter circle
    vector<Point> curvePoints = defineArc();
    // Display arc shape
    for (int n = 1; n < curvePoints.size(); n ++) {
      line( path, curvePoints[n - 1], curvePoints[n], Scalar(255, 255, 255), 2, 8);
    }

    distance = dist(first, last);
    // Compare shape of contour to arc, 0.0 = exact match, < 0.1
    if(!contours.empty() && matchShapes(contours[0], curvePoints, CV_CONTOURS_MATCH_I3, RETR_EXTERNAL) <= 0.0001 && distance > MIN_PTS_DIST) {
      double m1 = matchShapes(contours[0], curvePoints, CV_CONTOURS_MATCH_I1, RETR_EXTERNAL);
      double m2 = matchShapes(contours[0], curvePoints, CV_CONTOURS_MATCH_I2, RETR_EXTERNAL);
      double m3 = matchShapes(contours[0], curvePoints, CV_CONTOURS_MATCH_I3, RETR_EXTERNAL);
      if (center.x > 0 && center.y > 0)
        last = center;
      // Determine up/down - (0,0) is top left in any orientation
      if (last.y > first.y && distance > MIN_PTS_DIST && last.y != first.y) {
        down = true;
      }
      else if (last.y < first.y && distance > MIN_PTS_DIST && last.y != first.y) {
        up = true;
      }

      // Increment reps and reset directions
      if (up && down) {
        reps ++;
        up = false;
        down = false;
        sprintf(up_debug, " ");
        sprintf(down_debug, " ");
      }
      // Ignore down if up was not detected prior
      else if (!up && down) {
        // TODO: Uncomment this in release mode. Only commented out because I test in Portrait Upside Down mode
        down = false;
      }
    }
  }
  cvReleaseMemStorage(&storage);
  sprintf(debug, "%d %d", center.x, center.y);
  cv::putText(image, debug,
              Point2f(50, 125),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  
  sprintf(debug, "Arclength: %lf", distance);
  cv::putText(image, debug,
              Point2f(50, 150),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  
  sprintf(debug, "Radius: %d", largestCircleRadius);
  cv::putText(image, debug,
              Point2f(50, 200),
              FONT_HERSHEY_SIMPLEX, 0.5, Scalar(255, 255, 255), 1);
  // Add text for displaying counts
  char msg[20];
  sprintf (msg, "Reps: %d", reps);
  cv::putText(image, msg,
              Point2f(50, 50),
              FONT_HERSHEY_SIMPLEX, 1, Scalar(255, 255, 255), 1);

  image = cv::cvarrToMat(image_img) + image;
  // For debugging: display path instead of image
  //image = path;
  // Done processing current point so assign it to prev
  prev = cur;
}
