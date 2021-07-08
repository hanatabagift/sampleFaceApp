import * as faceapi from 'face-api.js'

(async () => {

  const $video = document.getElementById('webcam-video')

  // face detecting
  $video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })

  $video.play().then(async () => {
    // Load learned models
    await faceapi.nets.tinyFaceDetector.load('/weights')
    await faceapi.loadFaceLandmarkModel('/weights')
    await faceapi.loadFaceExpressionModel('/weights')

    const loop = async () => {

      if (!faceapi.nets.tinyFaceDetector.params) {
        return setTimeout(() => loop(), 5000)
      }
      const option = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      const result = await faceapi.detectSingleFace($video, option).withFaceExpressions()
      if (result) {

        //もっとも値が高かった感情を表示
        let expressionsMaxKey = ""
        let expressionsMaxValue = -Infinity
        let expressionsValues = Object.values(result.expressions);
        let expressionskeys = Object.keys(result.expressions);
        for (let i = 0, l = expressionsValues.length; i < l; i++) {
          if (expressionsMaxValue < expressionsValues[i]) {
            expressionsMaxValue = expressionsValues[i];
            expressionsMaxKey = expressionskeys[i];
          }
        }
        console.log(expressionsMaxKey);
        
      }
      setTimeout(() => loop(), 5000)
    }
    loop()
  })

})()
