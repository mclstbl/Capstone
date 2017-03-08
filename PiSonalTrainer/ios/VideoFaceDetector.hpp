//
//  VideoFaceDetector.hpp
//  PiSonalTrainer
//
//  Created by Micaela Estabillo on 3/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef VideoFaceDetector_hpp
#define VideoFaceDetector_hpp

#include <stdio.h>

#endif /* VideoFaceDetector_hpp */

#pragma once

#include <opencv2/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/objdetect/objdetect.hpp>

class VideoFaceDetector
{
public:
  VideoFaceDetector(const std::string cascadeFilePath, cv::VideoCapture &videoCapture);
  VideoFaceDetector(const std::string cascadeFilePath);
  ~VideoFaceDetector();
  
  cv::Point               getFrameAndDetect(cv::Mat &frame);
  void                    setFaceCascade(const std::string cascadeFilePath);
  cv::CascadeClassifier*  faceCascade() const;
  void                    setResizedWidth(const int width);
  int                     resizedWidth() const;
  bool                    isFaceFound() const;
  cv::Rect                face() const;
  cv::Point               facePosition() const;
  void                    setTemplateMatchingMaxDuration(const double s);
  double                  templateMatchingMaxDuration() const;
  
private:
  static const double     TICK_FREQUENCY;
  
  cv::CascadeClassifier*  m_faceCascade = NULL;
  std::vector<cv::Rect>   m_allFaces;
  cv::Rect                m_trackedFace;
  cv::Rect                m_faceRoi;
  cv::Mat                 m_faceTemplate;
  cv::Mat                 m_matchingResult;
  bool                    m_templateMatchingRunning = false;
  int64                   m_templateMatchingStartTime = 0;
  int64                   m_templateMatchingCurrentTime = 0;
  bool                    m_foundFace = false;
  double                  m_scale;
  int                     m_resizedWidth = 320;
  cv::Point               m_facePosition;
  double                  m_templateMatchingMaxDuration = 3;
  
  cv::Rect    doubleRectSize(const cv::Rect &inputRect, const cv::Rect &frameSize) const;
  cv::Rect    biggestFace(std::vector<cv::Rect> &faces) const;
  cv::Point   centerOfRect(const cv::Rect &rect) const;
  cv::Mat     getFaceTemplate(const cv::Mat &frame, cv::Rect face);
  void        detectFaceAllSizes(const cv::Mat &frame);
  void        detectFaceAroundRoi(const cv::Mat &frame);
  void        detectFacesTemplateMatching(const cv::Mat &frame);
};
