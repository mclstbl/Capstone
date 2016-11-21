# Import the necessary packages
from collections import deque
import numpy as np
import argparse
import imutils
import cv2

# These are required on some Macs so cv2 can be imported
# import sys
# sys.path.append('/Library/Python/2.7/site-packages')

# Construct the argument parse and parse the arguments
def init():
    ap = argparse.ArgumentParser()
    ap.add_argument("-v", "--video",
        help="path to the (optional) video file")
    ap.add_argument("-b", "--buffer", type=int, default=64,
        help="max buffer size")
    args = vars(ap.parse_args())
    return args
 
# If a video path was not supplied, grab the reference
# to the webcam
def setCamera():
    if not args.get("video", False):
        camera = cv2.VideoCapture(0)

# Otherwise, grab a reference to the video file
    else:
        camera = cv2.VideoCapture(args["video"])

    return camera

# Define the lower and upper boundaries of the "green"
# ball in the HSV color space, then initialize the
# list of tracked points

# def isArch(points):
#     print "*********************"
#     for i in xrange(1, len(pts)):
#         a = pts[i]
#         b = pts[i - 1]
#         if a is None or b is None:
#             continue
#         else: 
#             print slope(a, b)


# Keep looping
def cameraLoop(greenLower, greenUpper, pts, args):
    while True:
        # isArch(pts)
# Grab the current frame
        (grabbed, frame) = camera.read()

# If we are viewing a video and we did not grab a frame,
# then we have reached the end of the video
        if args.get("video") and not grabbed:
            break

# Resize the frame, blur it, and convert it to the HSV color space
        frame = imutils.resize(frame, width=600)
        # blurred = cv2.GaussianBlur(frame, (11, 11), 0)
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

# Construct a mask for the color "green", then perform
# a series of dilations and erosions to remove any small
# blobs left in the mask
        mask = cv2.inRange(hsv, greenLower, greenUpper)
        mask = cv2.erode(mask, None, iterations=2)
        mask = cv2.dilate(mask, None, iterations=2)

# Find contours in the mask and initialize the current
# (x, y) center of the ball
        cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE)[-2]
        center = None

# Only proceed if at least one contour was found
        if len(cnts) > 0:
# Find the largest contour in the mask, then use it to compute
# the minimum enclosing circle and centroid
            c = max(cnts, key=cv2.contourArea)
            ((x, y), radius) = cv2.minEnclosingCircle(c)
            M = cv2.moments(c)
            center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))

# Only proceed if the radius meets a minimum size
            if radius > 10:
# Draw the circle and centroid on the frame, then update the list of tracked points
                cv2.circle(frame, (int(x), int(y)), int(radius),
                    (0, 255, 255), 2)
                cv2.circle(frame, center, 5, (0, 0, 255), -1)

# Update the points queue
        pts.appendleft(center)

# Loop over the set of tracked points
        for i in xrange(1, len(pts)):
# If either of the tracked points are None, ignore them
            if pts[i - 1] is None or pts[i] is None:
                continue

# Otherwise, compute the thickness of the line and
# draw the connecting lines
            thickness = int(np.sqrt(args["buffer"] / float(i + 1)) * 2.5)
            cv2.line(frame, pts[i - 1], pts[i], (0, 0, 255), thickness)

# Show the frame to our screen
        cv2.imshow("Frame", frame)
        key = cv2.waitKey(1) & 0xFF

# If the 'q' key is pressed, stop the loop
        if key == ord("q"):
            break

# Cleanup the camera and close any open windows
def finish():
    camera.release()
    cv2.destroyAllWindows()

# MAIN FUNCTION
args = init()
camera = setCamera()
(greenLower, greenUpper, pts) = defineColour()
cameraLoop(greenLower, greenUpper, pts, args)
finish()