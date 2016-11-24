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

def isNegativeArch(points):
    validMax = 4
    ret = True
    if len(points) >= amountOfCollectedSlopes:
        for i in xrange(1, len(points)):
            if points[i - 1] is None or points[i] is None:
                return False
            if abs(points[i - 1]) > validMax or abs(points[i]) > validMax:
                return False
            ret = ret and (points[i - 1] <= points[i])
            if not ret:
                # print i
                return False
    else:
        return False
    return ret
        
def isPositiveArch(points):
    validMax = 4
    ret = True
    if len(points) >= amountOfCollectedSlopes:
        for i in xrange(1, len(points)):
            if points[i - 1] is None or points[i] is None:
                return False
            if abs(points[i - 1]) > validMax or abs(points[i]) > validMax:
                return False
            ret = ret and (points[i - 1] >= points[i])
            if not ret:
                # print i
                return False
    else:
        return False
    return ret
        
# Returns the slope between 2 (x,y) positions a and b
def slope(a, b):
    if(b[0] != a[0]):
        return (b[1] - a[1])/float(b[0] - a[0])
    return None

# Detects direction of object movement based on slopes between
# consecutive points, and also displacement along y-axis
def detectDirection(prev, cur, up, down, reps):
    slopeVal = slope(prev, cur)
    # print slopeVal
    slopes.appendleft(slopeVal)
    # print slopes
    if (isNegativeArch(slopes, )):
        print "Down"
        down = True
        slopes.clear()
    elif (isPositiveArch(slopes)):
        print "Up"
        up = True
        slopes.clear()
    
    if up and down:
        reps += 1
        up = False
        down = False

    return(up, down, reps)

# Define the lower and upper boundaries of the "green"
# ball in the HSV color space, then initialize the
# list of tracked points
def defineColour():
    # hsv = [55, 80, 140] #green ball
    # hsv = [166, 147, 174] #pink
    hsv = [55, 130, 175] #greenscreen green
    offset1 = 30
    offset2 = 100
    greenLower = (hsv[0]-offset1, hsv[1]-offset1, hsv[2]-offset2)
    greenUpper = (hsv[0]+offset1, hsv[1]+offset1, hsv[2]+offset2)
    pts = deque(maxlen = args["buffer"])
    return (greenLower, greenUpper, pts)

# Keep looping
def cameraLoop(camera, greenLower, greenUpper, pts, args, up, down, reps):
    prev = None
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
# Display counter on the screen
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame,'Counter: ' + str(reps), (400, 50), font, 1, (255, 255, 255), 1)
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

# Keep track of direction at each point and update the
# value of previous position
            if(prev is not None):
                (up, down, reps) = detectDirection(prev, center, up, down, reps)
            prev = center

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
        key = cv2.waitKey(33)

# If the 'esc' key is pressed, stop the loop
        if key == 27:
        	break

# Cleanup the camera and close any open windows
def finish(camera):
    camera.release()
    cv2.destroyAllWindows()

# Initialize counter variables
amountOfCollectedSlopes = 7
slopes = deque(maxlen = amountOfCollectedSlopes)
reps = 0
up = False
down = False

# Main function
args = init()
camera = setCamera()
(greenLower, greenUpper, pts) = defineColour()
cameraLoop(camera, greenLower, greenUpper, pts, args, up, down, reps)
finish(camera)