// ---------------------------
// initialize global variables
// ---------------------------

// Server configuration: This code requires the server to have CORS enabled (edit httpd.conf appropriately) 

// set-up data object --> all key values will be the headers on the output csv
var thisData = {
  "subjID":[],
  "workerId": [],
  "experimentName":[],
  "versionName": [],
  "sequenceName":[],
  "url":[],
  "selected_row": [],
  "windowWidth":[],
  "windowHeight":[],
  "screenWidth":[],
  "screenHeight":[],
  "startDate":[],
  "startTime":[],
  "trial": [],
  "stimulus":[],
  "duration": [],
  "actual_depth": [],
  "depth_estimate": [],
  "trial_RT":[],
  "log_sceneDuration": [],
  "unitSelection": [],
  "seq_filepath": []
  };

  var aqData = {}

// information flow: depth_duration_variables.csv --> url for participant --> counterbalancing csv indexed by url fragment --> sampled json path
// depth_duration_variables.csv is uploaded when publishing a batch --> This contains the url for each participant 

// Row of counterbalancing array to be sampled is stored in the url fragment (part after #)
var url = window.location.href 
var url_split = url.split("#")
var url_num = url_split[url_split.length - 1]
console.log(url_num)

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var stimulus, duration, actual_depth, depth_estimate, endExpTime, startExpTime, RT, log_sceneDuration, reported_age, ypos, reported_gender; 
var workerId = "";

// unit preference variables 
var pref = false // unit preference has not been made
var unit = null

// constant timing variables 
var fixation_time = 500
var mask_time = 500 

var practice_trial = 0 // counter that references the index of the practice_seq variable 
// var practice_seq = JSON.parse('[{"sequence": "practice", "image": "practice/000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize_5", "duration": 250, "num": 1, "depth": 2.0525, "image_path": "practice/000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize_5/000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize-original.jpg", "image_path_target": "practice/000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize_5/000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize_5-target.png", "mask_path": "masks/mask_252.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice", "image": "practice/003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize_3", "duration": 750, "num": 2, "depth": 3.588, "image_path": "practice/003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize_3/003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize-original.jpg", "image_path_target": "practice/003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize_3/003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize_3-target.png", "mask_path": "masks/mask_129.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice", "image": "practice/001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize_2", "duration": 500, "num": 3, "depth": 1.539, "image_path": "practice/001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize_2/001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize-original.jpg", "image_path_target": "practice/001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize_2/001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize_2-target.png", "mask_path": "masks/mask_2.jpg", "fixation_path": "fixation.jpg", "sampled": 0}]')
// Aug 9: practice sequence is now 8 trials with 2 catch trials (image with no target)

var pseq_json = [{"sequence": "practice", "image": "practice/003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2", "duration": 125, "num": 4, "depth": 1.666, "image_path": "practice/003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2/003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize-original.jpg", "image_path_target": "practice/003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2/003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0},{"sequence": "practice", "image": "practice/001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4", "duration": 125, "num": 2, "depth": 3.4025, "image_path": "practice/001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4/001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize-original.jpg", "image_path_target": "practice/001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4/001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice", "image": "practice/000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3", "duration": 125, "num": 3, "depth": 2.8, "image_path": "practice/000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3/000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize-original.jpg", "image_path_target": "practice/000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3/000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice_catch", "image": "practice/002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize_0", "duration": 125, "num": 8, "depth": 3.9524999999999997, "image_path": "practice/002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize_0/002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize-original.jpg", "image_path_target": "practice/002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize_0/002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize-original.jpg", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice", "image": "practice/003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3", "duration": 125, "num": 1, "depth": 3.877, "image_path": "practice/003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3/003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize-original.jpg", "image_path_target": "practice/003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3/003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice", "image": "practice/001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2", "duration": 125, "num": 5, "depth": 2.7439999999999998, "image_path": "practice/001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2/001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize-original.jpg", "image_path_target": "practice/001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2/001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice_catch", "image": "practice/002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize_2", "duration": 125, "num": 7, "depth": 2.107, "image_path": "practice/002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize_2/002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize-original.jpg", "image_path_target": "practice/002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize_2/002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize-original.jpg", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}, {"sequence": "practice", "image": "practice/001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3", "duration": 125, "num": 6, "depth": 1.8725, "image_path": "practice/001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3/001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize-original.jpg", "image_path_target": "practice/001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3/001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg", "sampled": 0}]
var practice_seq = JSON.parse(JSON.stringify(pseq_json))

var practiced = false // practice trials have not been completed 

var trial = 0 //counter that references the index of the stim_seq variable

var counter = 0 // counter for logging 


// 192 trials in a full experiment 
// Aug 2022 version = 164 trials in a full experiment, 8 catch trials
// 128 trials in a full indoor&outdoor experiment 
var num_trials = 163 // 163 // since indexing starts at zero num_trial = actual total trials - 1

// solves problem of last practice variables being saved in the estimate variable and getting recorded 
// set to true once trial has actually begun NOT in the beginning of the function because the practice trial is still saved in the estimate variable
var start_recording = false 
var age_recorded = false

// reads in counterbalancing csv and calls function to get sequence filepath 
var data = $.ajax({
                url: 'counterbalancing.csv',
                dataType: 'text',
              }).done(successFunction);


function successFunction(data) {
  // reads in CSV and converts to JS array
  var allRows = data.split(/\r?\n|\r/);
  var table = [];
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    var rowCells = allRows[singleRow].split(',');
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (rowCell == 0){
        var table_row = []
      }                 
      table_row.push(rowCells[rowCell]);
    }
    table.push(table_row);

  }
  counterbalancing_array = table

  seq_filepath = counterbalancing_array[url_num][0]; // filepath is the first element of the row (passed in through URL)
  selected_row = url_num; // log which row was selected 
  console.log(seq_filepath)

  
  // // loops through all rows in table to find the earliest row that has not been sampled
  // var found = false;
  // for (var row = 1; row < table.length; row++){
  //   var sampled = table[row][1];
  //   if (found == false){
  //     if (sampled == "0"){
  //       seq_filepath = table[row][0]; // selects filepath that has not been sampled yet 
  //       counterbalancing_array[row][1] = "1"
  //       var found = true;
  //       selected_row = row; // log which row was selected so CSV can be updated post-experiment (Sampled: 0 --> 1)
  //     }
  //   }

  // }

  // ajax request for selected JSON (seq_filepath)
  stim_seq = $.ajax({ // loads in stimulus sequence from server
                          url: seq_filepath,
                          method: 'GET',
                          dataType: 'json',
                          data: JSON.stringify(),
                          success: function (data) {
                            stim_seq = data; 
                            sequenceName = seq_filepath// get sequence name, which is pushed in saveTrialData
                            preload(practice_seq, stim_seq); // calls function to preload all scene images 
                            preloadMasks(practice_seq, stim_seq); // calls function to preload all mask images 
                          },
                });

}

var practice_positions = {'000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize_5': 367,
'001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize_2': 280,
'003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize_3': 230,
'003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3': 193,
'001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4': 170,
'000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3': 132,
'003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2': 277,
'001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2': 133,
'001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3': 274,
'002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize_2': 114,
'002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize_0': 101}

var positions = {'000866_2014-06-09_20-45-42_260595134347_rgbf000139-resize_1': 91,
 '002987_2014-06-08_18-48-20_094959634447_rgbf000022-resize_0': 199,
 '001417_2014-06-19_16-25-36_260595134347_rgbf000115-resize_5': 168,
 '003070_2014-06-15_14-58-27_094959634447_rgbf000150-resize_3': 192,
 '001092_2014-06-15_17-34-58_260595134347_rgbf000171-resize_3': 277,
 '002272_2014-06-28_18-53-56_260595134347_rgbf000067-resize_2': 340,
 '002700_2014-06-22_11-27-02_094959634447_rgbf000124-resize_3': 166,
 '000642_2014-06-08_16-59-25_260595134347_rgbf000098-resize_2': 238,
 '002549_2014-06-24_13-41-39_094959634447_rgbf000022-resize_3': 319,
 '000009_2014-05-26_14-32-05_260595134347_rgbf000034-resize_3': 50,
 '002570_2014-06-24_13-59-54_094959634447_rgbf000059-resize_0': 110,
 '000505_2014-06-08_23-03-23_260595134347_rgbf000091-resize_0': 350,
 '002988_2014-06-15_12-24-20_094959634447_rgbf000150-resize_1': 82,
 '001815_2014-06-26_20-52-55_260595134347_rgbf000020-resize_0': 73,
 '001498_2014-06-19_17-45-14_260595134347_rgbf000129-resize_4': 346,
 '002949_2014-06-26_15-57-42_094959634447_rgbf000079-resize_1': 250,
 '000549_2014-06-08_22-10-24_260595134347_rgbf000247-resize_3': 382,
 '001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2': 133,
 '000506_2014-06-08_23-21-00_260595134347_rgbf000070-resize_7': 164,
 '000953_2014-06-08_11-42-19_260595134347_rgbf000083-resize_0': 460,
 '002725_2014-06-22_11-47-51_094959634447_rgbf000070-resize_1': 112,
 '000109_2014-05-14_23-41-52_260595134347_rgbf000035-resize_9': 387,
 '002875_2014-06-01_15-19-00_094959634447_rgbf000151-resize_1': 43,
 '000810_2014-06-08_17-20-01_260595134347_rgbf000105-resize_0': 265,
 '000502_2014-06-08_23-02-32_260595134347_rgbf000063-resize_4': 284,
 '000469_2014-06-09_19-42-10_260595134347_rgbf000081-resize_1': 279,
 '001724_2014-06-26_19-28-50_260595134347_rgbf000037-resize_7': 215,
 '000635_2014-06-08_16-38-42_260595134347_rgbf000106-resize_1': 145,
 '002678_2014-06-13_16-15-32_094959634447_rgbf000151-resize_6': 120,
 '001012_2014-06-08_23-19-38_260595134347_rgbf000057-resize_0': 471,
 '001650_2014-06-20_12-09-00_260595134347_rgbf000087-resize_3': 422,
 '000929_2014-06-09_16-33-19_260595134347_rgbf000139-resize_0': 235,
 '003125_2014-05-12_10-39-22_094959634447_rgbf000100-resize_0': 89,
 '001392_2014-06-19_16-07-59_260595134347_rgbf000046-resize_1': 107,
 '000665_2014-06-09_20-42-35_260595134347_rgbf000110-resize_1': 244,
 '000436_2014-06-09_22-25-11_260595134347_rgbf000137-resize_1': 97,
 '001148_2014-06-17_15-26-42_260595134347_rgbf000129-resize_0': 63,
 '000742_2014-06-08_18-48-09_260595134347_rgbf000164-resize_4': 101,
 '001029_2014-06-08_13-17-57_260595134347_rgbf000065-resize_1': 156,
 '003492_2014-05-21_15-50-55_094959634447_rgbf000828-resize_1': 152,
 '000943_2014-06-09_19-31-07_260595134347_rgbf000128-resize_1': 240,
 '000137_2014-05-20_17-04-49_260595134347_rgbf000120-resize_1': 86,
 '002784_2014-06-22_19-26-30_094959634447_rgbf000083-resize_3': 369,
 '002953_2014-06-08_17-32-18_094959634447_rgbf000059-resize_5': 354,
 '000720_2014-06-08_18-37-27_260595134347_rgbf000203-resize_4': 263,
 '001066_2014-06-08_22-03-20_260595134347_rgbf000066-resize_4': 60,
 '003395_2014-05-20_15-39-18_094959634447_rgbf000101-resize_0': 52,
 '003338_2014-05-20_11-01-23_094959634447_rgbf000051-resize_6': 330,
 '002579_2014-06-24_14-08-03_094959634447_rgbf000061-resize_2': 214,
 '000749_2014-06-08_21-55-06_260595134347_rgbf000070-resize_2': 192,
 '001170_2014-06-17_15-43-44_260595134347_rgbf000096-resize_6': 406,
 '000709_2014-06-08_13-51-55_260595134347_rgbf000068-resize_3': 70,
 '000692_2014-06-08_13-09-42_260595134347_rgbf000199-resize_2': 148,
 '002136_2014-06-25_21-18-03_260595134347_rgbf000109-resize_3': 252,
 '002340_2014-06-28_20-05-46_260595134347_rgbf000113-resize_0': 70,
 '002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize_0': 101,
 '000457_2014-06-08_16-52-43_260595134347_rgbf000199-resize_1': 137,
 '001136_2014-06-17_15-19-41_260595134347_rgbf000076-resize_3': 100,
 '000191_2014-05-12_17-07-38_260595134347_rgbf000199-resize_0': 25,
 '001016_2014-06-09_16-16-10_260595134347_rgbf000112-resize_5': 150,
 '000368_2014-06-09_15-53-01_260595134347_rgbf000155-resize_2': 370,
 '001150_2014-06-17_15-27-34_260595134347_rgbf000108-resize_2': 50,
 '002199_2014-06-28_18-33-56_260595134347_rgbf000074-resize_0': 343,
 '002637_2014-06-24_14-51-13_094959634447_rgbf000066-resize_4': 161,
 '000454_2014-06-08_16-37-28_260595134347_rgbf000048-resize_2': 408,
 '002905_2014-06-03_18-04-43_094959634447_rgbf000151-resize_2': 257,
 '003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3': 193,
 '003292_2014-05-14_21-53-49_094959634447_rgbf000100-resize_2': 230,
 '002209_2014-06-28_18-36-10_260595134347_rgbf000051-resize_1': 267,
 '003587_2014-05-23_16-48-02_094959634447_rgbf002384-resize_2': 415,
 '001449_2014-06-19_17-01-27_260595134347_rgbf000116-resize_2': 129,
 '003546_2014-05-22_15-48-53_094959634447_rgbf004816-resize_3': 365,
 '001164_2014-06-17_15-35-46_260595134347_rgbf000085-resize_3': 106,
 '001110_2014-06-15_17-25-28_260595134347_rgbf000150-resize_1': 255,
 '002364_2014-06-28_20-11-05_260595134347_rgbf000042-resize_0': 70,
 '000830_2014-06-04_19-49-31_260595134347_rgbf000096-resize_2': 360,
 '003010_2014-06-15_12-54-35_094959634447_rgbf000112-resize_0': 125,
 '002118_2014-06-25_20-32-08_260595134347_rgbf000078-resize_1': 282,
 '002153_2014-06-25_21-27-18_260595134347_rgbf000038-resize_5': 303,
 '001540_2014-06-20_17-01-05_260595134347_rgbf000086-resize_2': 289,
 '001032_2014-06-08_13-23-17_260595134347_rgbf000021-resize_3': 277,
 '002657_2014-06-13_15-29-54_094959634447_rgbf000150-resize_1': 213,
 '002663_2014-06-13_15-50-26_094959634447_rgbf000075-resize_1': 44,
 '003129_2014-05-12_10-48-10_094959634447_rgbf000100-resize_0': 107,
 '000103_2014-05-14_22-01-17_260595134347_rgbf000152-resize_5': 192,
 '002675_2014-06-13_16-08-49_094959634447_rgbf000151-resize_2': 154,
 '001133_2014-06-17_14-49-16_260595134347_rgbf000100-resize_0': 178,
 '000470_2014-06-09_19-42-40_260595134347_rgbf000094-resize_1': 251,
 '001158_2014-06-17_15-32-16_260595134347_rgbf000138-resize_2': 119,
 '002344_2014-06-28_20-06-29_260595134347_rgbf000030-resize_1': 430,
 '000486_2014-06-09_20-47-20_260595134347_rgbf000143-resize_2': 112,
 '000854_2014-06-09_19-43-13_260595134347_rgbf000066-resize_0': 205,
 '002039_2014-06-24_20-22-38_260595134347_rgbf000084-resize_1': 71,
 '000569_2014-06-09_22-51-47_260595134347_rgbf000141-resize_3': 88,
 '002103_2014-06-25_20-00-40_260595134347_rgbf000049-resize_0': 75,
 '001570_2014-06-20_17-21-09_260595134347_rgbf000135-resize_4': 21,
 '000522_2014-06-08_13-35-06_260595134347_rgbf000244-resize_1': 356,
 '001450_2014-06-19_17-02-03_260595134347_rgbf000203-resize_4': 68,
 '002788_2014-06-22_19-36-03_094959634447_rgbf000088-resize_2': 139,
 '002213_2014-06-28_18-37-58_260595134347_rgbf000055-resize_1': 70,
 '001617_2014-06-20_11-35-32_260595134347_rgbf000066-resize_1': 64,
 '002365_2014-06-28_20-11-21_260595134347_rgbf000102-resize_1': 83,
 '002072_2014-06-24_21-48-06_260595134347_rgbf000115-resize_0': 140,
 '000375_2014-06-08_11-17-29_260595134347_rgbf000133-resize_2': 60,
 '000787_2014-06-08_22-33-53_260595134347_rgbf000175-resize_1': 74,
 '003495_2014-05-21_16-01-51_094959634447_rgbf000100-resize_3': 388,
 '002660_2014-06-13_15-44-18_094959634447_rgbf001878-resize_2': 195,
 '001806_2014-06-26_20-50-20_260595134347_rgbf000091-resize_1': 329,
 '002444_2014-06-28_20-32-08_260595134347_rgbf000027-resize_0': 143,
 '003423_2014-05-21_10-23-26_094959634447_rgbf002665-resize_2': 264,
 '001059_2014-06-08_21-53-27_260595134347_rgbf000061-resize_4': 228,
 '003534_2014-05-22_15-06-10_094959634447_rgbf000102-resize_4': 404,
 '001244_2014-06-17_16-47-45_260595134347_rgbf000030-resize_4': 163,
 '000682_2014-06-08_23-14-58_260595134347_rgbf000041-resize_5': 282,
 '001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4': 170,
 '000917_2014-06-09_22-45-29_260595134347_rgbf000149-resize_3': 60,
 '002989_2014-06-15_12-25-03_094959634447_rgbf000150-resize_3': 53,
 '001100_2014-06-15_17-46-26_260595134347_rgbf000225-resize_2': 338,
 '000521_2014-06-08_13-34-35_260595134347_rgbf000191-resize_2': 312,
 '000556_2014-06-09_22-42-56_260595134347_rgbf000214-resize_1': 200,
 '002305_2014-06-28_19-56-50_260595134347_rgbf000102-resize_7': 203,
 '001447_2014-06-19_17-00-32_260595134347_rgbf000082-resize_5': 184,
 '001810_2014-06-26_20-51-35_260595134347_rgbf000040-resize_3': 270,
 '003069_2014-06-15_14-57-50_094959634447_rgbf000150-resize_4': 87,
 '002460_2014-06-28_20-35-43_260595134347_rgbf000028-resize_4': 391,
 '001516_2014-06-20_16-25-09_260595134347_rgbf000076-resize_2': 161,
 '002630_2014-06-24_14-47-50_094959634447_rgbf000055-resize_1': 62,
 '003083_2014-06-15_15-21-03_094959634447_rgbf000063-resize_1': 136,
 '000927_2014-06-09_16-32-30_260595134347_rgbf000123-resize_3': 115,
 '002057_2014-06-24_21-00-13_260595134347_rgbf000120-resize_1': 54,
 '003621_2014-05-23_18-06-08_094959634447_rgbf000101-resize_1': 84,
 '002323_2014-06-28_20-01-54_260595134347_rgbf000051-resize_4': 127,
 '003081_2014-06-15_15-19-16_094959634447_rgbf000150-resize_1': 170,
 '001056_2014-06-08_18-46-44_260595134347_rgbf000068-resize_0': 192,
 '001181_2014-06-17_15-50-57_260595134347_rgbf000106-resize_4': 79,
 '001199_2014-06-17_16-03-48_260595134347_rgbf000077-resize_0': 68,
 '001055_2014-06-08_18-45-35_260595134347_rgbf000111-resize_4': 51,
 '000740_2014-06-08_18-46-23_260595134347_rgbf000049-resize_6': 235,
 '000555_2014-06-09_22-42-23_260595134347_rgbf000037-resize_4': 335,
 '002790_2014-06-22_19-36-35_094959634447_rgbf000074-resize_4': 182,
 '003048_2014-06-15_13-49-43_094959634447_rgbf000150-resize_1': 120,
 '001132_2014-06-17_14-48-54_260595134347_rgbf000100-resize_2': 121,
 '002445_2014-06-28_20-32-16_260595134347_rgbf000029-resize_4': 321,
 '000493_2014-06-09_21-01-18_260595134347_rgbf000196-resize_3': 141,
 '002964_2014-06-08_17-46-11_094959634447_rgbf000091-resize_4': 407,
 '000736_2014-06-08_18-24-15_260595134347_rgbf000206-resize_3': 266,
 '001828_2014-06-26_21-40-03_260595134347_rgbf000024-resize_0': 106,
 '000483_2014-06-09_20-41-45_260595134347_rgbf000116-resize_4': 350,
 '002043_2014-06-24_20-29-38_260595134347_rgbf000039-resize_4': 119,
 '000542_2014-06-08_18-27-08_260595134347_rgbf000118-resize_1': 218,
 '001052_2014-06-08_18-24-54_260595134347_rgbf000130-resize_1': 58,
 '000780_2014-06-08_22-28-29_260595134347_rgbf000126-resize_1': 81,
 '000773_2014-06-08_22-24-54_260595134347_rgbf000093-resize_1': 141,
 '000868_2014-06-09_20-49-52_260595134347_rgbf000064-resize_4': 345,
 '003228_2014-05-14_13-42-35_094959634447_rgbf000101-resize_1': 304,
 '002467_2014-06-28_20-38-07_260595134347_rgbf000026-resize_2': 125,
 '001555_2014-06-20_17-12-10_260595134347_rgbf000065-resize_4': 390,
 '001011_2014-06-08_23-18-54_260595134347_rgbf000044-resize_4': 212,
 '000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3': 132,
 '003490_2014-05-21_15-50-11_094959634447_rgbf000101-resize_3': 161,
 '002414_2014-06-28_20-24-58_260595134347_rgbf000067-resize_4': 174,
 '002509_2014-06-24_13-19-22_094959634447_rgbf000077-resize_0': 300,
 '003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2': 277,
 '002568_2014-06-24_13-59-21_094959634447_rgbf000062-resize_4': 162,
 '002425_2014-06-28_20-27-29_260595134347_rgbf000031-resize_8': 99,
 '002600_2014-06-24_14-27-04_094959634447_rgbf000074-resize_2': 208,
 '001235_2014-06-17_16-37-36_260595134347_rgbf000084-resize_4': 150,
 '000739_2014-06-08_18-45-58_260595134347_rgbf000068-resize_1': 140,
 '002131_2014-06-25_21-12-01_260595134347_rgbf000083-resize_0': 50,
 '001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3': 274,
 '001175_2014-06-17_15-45-55_260595134347_rgbf000129-resize_4': 65,
 '002375_2014-06-28_20-13-44_260595134347_rgbf000032-resize_1': 249,
 '000788_2014-06-08_22-34-36_260595134347_rgbf000131-resize_1': 228,
 '000409_2014-06-04_19-23-33_260595134347_rgbf000067-resize_0': 280,
 '000677_2014-06-08_23-10-32_260595134347_rgbf000158-resize_6': 196,
 '002279_2014-06-28_18-55-32_260595134347_rgbf000040-resize_5': 339,
 '002748_2014-06-22_19-07-22_094959634447_rgbf000078-resize_1': 54,
 '000735_2014-06-08_18-23-50_260595134347_rgbf000163-resize_2': 168,
 '002545_2014-06-24_13-38-53_094959634447_rgbf000080-resize_4': 137,
 '000753_2014-06-08_21-57-44_260595134347_rgbf000123-resize_3': 329,
 '002468_2014-06-28_20-38-39_260595134347_rgbf000045-resize_1': 76,
 '001289_2014-06-16_16-25-52_260595134347_rgbf000067-resize_1': 350,
 '001584_2014-06-20_11-07-43_260595134347_rgbf000002-resize_1': 62,
 '002750_2014-06-22_19-08-03_094959634447_rgbf000094-resize_4': 195,
 '000734_2014-06-08_17-39-11_260595134347_rgbf000128-resize_2': 64,
 '002805_2014-06-22_19-54-03_094959634447_rgbf000079-resize_1': 143,
 '000691_2014-06-08_13-08-50_260595134347_rgbf000132-resize_3': 249,
 '000906_2014-06-08_13-35-43_260595134347_rgbf000155-resize_1': 71,
 '001532_2014-06-20_16-50-41_260595134347_rgbf000081-resize_4': 428,
 '002763_2014-06-22_19-13-10_094959634447_rgbf000075-resize_4': 185,
 '001214_2014-06-17_16-13-55_260595134347_rgbf000111-resize_0': 272,
 '002758_2014-06-22_19-11-20_094959634447_rgbf000128-resize_1': 290,
 '002639_2014-06-24_14-51-37_094959634447_rgbf000074-resize_4': 140,
 '000869_2014-06-09_20-50-18_260595134347_rgbf000060-resize_3': 149,
 '003079_2014-06-15_15-18-20_094959634447_rgbf000152-resize_8': 64,
 '001222_2014-06-17_16-24-06_260595134347_rgbf000073-resize_0': 416,
 '000414_2014-06-04_19-49-13_260595134347_rgbf000044-resize_0': 68,
 '001264_2014-06-16_16-10-23_260595134347_rgbf000109-resize_1': 171,
 '002995_2014-06-15_12-31-26_094959634447_rgbf000150-resize_1': 116,
 '000447_2014-06-08_16-15-46_260595134347_rgbf000130-resize_1': 138,
 '001094_2014-06-15_17-36-00_260595134347_rgbf000205-resize_0': 82,
 '001808_2014-06-26_20-50-58_260595134347_rgbf000029-resize_1': 72,
 '000758_2014-06-08_22-05-08_260595134347_rgbf000085-resize_0': 122,
 '001571_2014-06-20_17-21-32_260595134347_rgbf000089-resize_1': 298,
 '000878_2014-06-08_22-52-45_260595134347_rgbf000045-resize_2': 97,
 '001167_2014-06-17_15-38-07_260595134347_rgbf000108-resize_0': 293,
 '002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize_2': 114,
 '000636_2014-06-08_16-39-02_260595134347_rgbf000108-resize_4': 215}


// ----------------
// set-up functions
// ----------------

$(document).ready(function(){

  // on open, add text to the startingInstructions div 
  $(".buttonDivPg2").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
  $("#getConsent").hide();
  $(".workerIdDiv").hide(); // hide WorkerId input page

  $("#start_trials").hide()
  $(".startTrialsButtonDiv").hide();


  $("#Instructions2").hide();
  $("#restart_trials").hide();
  $("#restartTrialsButton").hide();
  $("#FinalInstructions").hide();
  $("#container-questionnaire").hide();


  $("#startingInstructions").append( 
    "<h1>Thank you for accepting this HIT!</h1>"
    + "<p>In this Human Intelligence Task (HIT), you are asked to make judgments about everyday objects and scenes. This psychology task takes about 25 minutes and you will be compensated $2.90.</p>"
    + "<p>This research is conducted by the Cognitive Neuroscience Lab at the George Washington University. You may contact us at kravitzlab.online@gmail.com.</p>"
    + "<p>This task can only be completed once. If you have already completed this task before the system will not allow you to run again. If this looks familiar please return the HIT so someone else can participate. </p>"
    + "<p>Otherwise, please click 'NEXT' to reveal further instructions and an informed consent agreement.</p>"
    );


  document.getElementById("subjID").value = subjID;
  document.getElementById("startDate").value = startDate;
  document.getElementById("startTime").value = startTime;

});


// INSTRUCTIONS & CONSENT - Before Practice // 


function showConsent(){
  $(".buttonDivPg2").show();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
  $(".workerIdDiv").hide(); // hide WorkerId input page



  $("#startingInstructions").hide();
  $("#Instructions2").hide();

  $("#FinalInstructions").hide()
  $("#container-questionnaire").hide();
  $("#getConsent").show();


  // $("#getConsent").append( 
  //   "<h1>Title of Study: The Visual Determinants of Size in Natural Scenes </h1>"
  //   + "<br>IRB #: 04168<br/>"
  //   + "<br>Version Date: 7/09/20<br/>"

  //   + "<p>The purpose of this study is to investigate how people determine the size of objects in pictures of natural scenes.</p>"
  //   + "<p>If you choose to take part in this study, you will participate in a research activity that involves viewing a series of pictures and answering questions about them. For example, for each picture, you might be asked about the sizes or spatial relationships of objects in the scene, or what objects were present in the scene. The total amount of time you will spend in connection with this study is about 20 minutes, and you will receive $2.50 as compensation for your participation. You may refuse to answer any of the questions and you may stop your participation in this study at any time.</p>"
  //   + "<p>Possible risks or discomforts you could experience during this study include: boredom or loss of confidentiality (for example, depending on where you are, someone might see you taking part in the study). </p>"
  //   + "<p>You will not benefit directly from your participation in the study. The benefit to science and humankind that might result from this study is: a clearer understanding about how people perceive the size and spatial relationships among objects in natural scenes.</p>"
  //   + " <p> Every effort will be made to keep your information confidential, however, this cannot be guaranteed. We will not receive any information about you other than your responses to the study questions. If results of this research study are reported in journals or at scientific meetings, the people who participated in this study will not be named or identified. <p/>"
  //   + "<p> The Office of Human Research of George Washington University, at telephone number (202) 994-2715, can provide further information about your rights as a research participant.<p/>"
  //   + "<p> Your willingness to participate in this research study is implied if you proceed.<p/>"
  //   + "<p> Please click 'AGREE' if you have read the consent form and agree to participate. If you do not consent to participate, close this window.<p/>"
  //   );
}


// SHOW WORKER ID PAGE AFTER USER INDICATES THEY ARE A TURK WORKER WITH A VALID WORKER ID 
function showWorkerIdInputBox(){

	$("#getConsent").hide();
  $(".buttonDivPg2").hide();
	$("#findWorkerId").attr("src","findWorkerId.bmp"); // attribute bmp file name to img describing how/where to find workerId 
	$(".workerIdDiv").show(); // show WorkerId input page 

}

// SAVE TURK WORKER ID (FROM TEXTBOX INPUT) WHEN USER CLICKS "NEXT" ON WORKER ID PAGE 
function saveWorkerId(){
	
	workerId = document.getElementById("turkWorkerId").value; // save workerId to variable  
	if (workerId != ""){  
		$(".workerIdDiv").hide(); // hide WorkerId input page 
		nextInstructions();  
	}
	else{   
		_text = "You must enter a valid MTurk Worker ID in order to proceed";  
		document.getElementById("workerId_feedback").innerHTML = _text; 
		window.alert("You must enter a valid MTurk Worker ID in order to proceed");
	}
}

function nextInstructions(){
  $("#getConsent").hide();
  $("#Instructions2").show();
  $("#FinalInstructions").hide()
  $("#container-questionnaire").hide();

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").show();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
}

function finalInstructions(){
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").show()
  $("#container-questionnaire").hide();

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
  $(".buttonDivPg4").show()

  $("#FinalInstructions").append(
    "<h1> Instructions </h1>"
    + "<p> A fixation cross will appear in the center of the screen - focus on this cross. The target will then appear for a brief amount of time, so make sure you are watching closely as to not miss the target. Then, the scene and target will disappear, and you will see an image of colored squares. Once this image disappears you will be prompted to enter your distance judgment. Be sure to give your estimate as a single number, rather than a range of possible values. You can use decimals to indicate fractions. After entering your distance judgment, click the 'NEXT' button. As soon as you click this button, the fixation cross will be displayed.</p>"
    + "<b> On some trials, there will be NO target. On these trials, enter '0' in the response box. </b>"
    + "<p> We ask that you pay close attention on each trial so you detect all of the targets, but occasionally you may accidentally miss one. If you do, please enter '0' in the response box. You will not be penalized for missing a target, we'd just like to know so we can factor this into our analysis later.</p>"
    + "<p> You will see 164 images, and the experiment will take approximately 20 minutes. </p>"
    + "<p> The experiment will begin with eight practice trials. If you are ready to begin, please click 'BEGIN' below. </p>"
    )
}

function getUnits(){
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").hide();
  $("#getUnits").show()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").show()
  $(".feetButtonDiv").show()

  $("#getUnits").append(
    "<p> This study will ask you to estimate the distance of objects. What unit of measurement would you like to use?<p/>"
    )
}

function recordUnitsMeters(){
  pref = true // units have been chosen 
  unit = "meters"
  console.log(unit)

  $("#getUnits").hide()
  $(".metersButtonDiv").hide()
  $(".feetButtonDiv").hide()

  $(".startPracticeButtonDiv").show()

}

function recordUnitsFeet(){
  pref = true // units have been chosen 
  unit = "feet"
  console.log(unit)

  $("#getUnits").hide()
  $(".metersButtonDiv").hide()
  $(".feetButtonDiv").hide()
  $(".startPracticeButtonDiv").show()

}

function startPractice(){
  // not recording responses from practice trials 

  $(".startPracticeButtonDiv").hide()
  $(".practice_feedbackDiv").hide()

  if (practice_trial > 7){
    practiced = true
    $("#start_trials").show()
    $(".startTrialsButtonDiv").show();

  }

  else{
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // Timing note: time accumulates so it is not actual duration but relative time
    // have to account for the time already spent
    var scene = setTimeout(function(){showScene();}, fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask();}, fixation_time + scene_duration); 
    var response = setTimeout(function(){getResponse();}, fixation_time + scene_duration + mask_time)
  }
}

function runTrial(){ 

  $(".startPracticeButtonDiv").hide()
  $("#start_trials").hide()
  $(".startTrialsButtonDiv").hide();

  $("#restart_trials").hide();
  $("#restartTrialsButton").hide();
  $(".practice_feedbackDiv").hide()


  if (start_recording == true){ // prevents the last practice trial from being recorded 
    var trial_params = getTrialParams();

    stimulus = trial_params[0]
    duration = trial_params[1]
    actual_depth = trial_params[2]

    depth_estimate = document.getElementById("numb").value;
    console.log(depth_estimate)

    endTrialTime = new Date; // time at which response has been given for past trial
    RT = endTrialTime - startTrialTime;

    saveTrialData();

    counter ++;

  }

  if (trial == 0){
    startExpTime = new Date; // get start time of first trial to calculate total experiment time
  }

  if (trial > num_trials){ 
    endExpTime = new Date; //get time of end of last block to calculate total experiment time

    getAge();

  }

  else{
    console.log(trial)

    start_recording = true; // start recording because practice trials are done 
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // Timing note: time accumulates so it is not actual duration but relative time
    // have to account for the time already spent
    var scene = setTimeout(function(){showScene();}, fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask();}, fixation_time + scene_duration); 
    var response = setTimeout(function(){getResponse();}, fixation_time + scene_duration + mask_time)
      
  }
}



function showFixation(){

  f_path = "fixation.jpg"
  $("#fixation_image").attr("src", f_path)

  $(document).ready(function(){
    $(".fixationDiv").show();
    $(".practice_feedbackDiv").hide()
  })

}

function showScene(){
  if (practiced == false){
    var s_path = practice_seq[practice_trial].image_path_target

    var s_path_split = s_path.split("/")
    var folder = s_path_split[s_path_split.length - 2]
    // 530 (height of image)/2 = 265 (location of fixation)
    // ypos is the distance from fixation (center of image)
    var ypos = practice_positions[folder] 

    var doc_height = $(document).height()

    if (ypos >= (530/2)){
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }
    else{
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }

    // var top_px = doc_height/2 - 530/2; // should bring image to center 
    console.log(top_px)
    var num_string = top_px.toString();

    var pos = document.getElementById("scene");
    pos.style.top = num_string + 'px'

    $("#scene_image").attr("src", s_path);


    var s_duration = practice_seq[practice_trial].duration 
    var actual_depth = stim_seq[trial].depth

  }

  else{ 
    startTrialTime = new Date; // time at which the scene is presented for a given trial 

    var s_path = stim_seq[trial].image_path_target

    var s_path_split = s_path.split("/")
    var folder = s_path_split[s_path_split.length - 2]
    var ypos = positions[folder] 

    $("#scene_image").attr("src", s_path);
    var doc_height = $(document).height()
    console.log(ypos, 'ypos')
    if (ypos >= (530/2)){
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }
    else{ 
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)

    }
    var num_string = top_px.toString();
    var pos = document.getElementById("scene");
    pos.style.top = num_string + 'px'
    
    // var top_px = doc_height/2 - 530/2; // should bring image to center     


    var s_duration = stim_seq[trial].duration 
    var actual_depth = stim_seq[trial].depth
  }

  startSceneTimeLog = new Date; // time at which scene is presented 
  


  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".maskDiv").hide();
    $(".sceneDiv").show();
    $(".practice_feedbackDiv").hide()
  })

}

function getTrialDuration(){ // from sequence json
  if (practiced == false){
    var stim_duration = stim_seq[practice_trial].duration 
  }
  else{ 
    var stim_duration = stim_seq[trial].duration
  }
  return stim_duration
}

function showMask(){
  if (practiced == false){
    var m_path = practice_seq[practice_trial].mask_path
  }
  else{ 
    var m_path = stim_seq[trial].mask_path
  }

  endSceneTimeLog = new Date;
  log_sceneDuration = endSceneTimeLog - startSceneTimeLog;
  $("#mask_image").attr("src", m_path);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").show();
    $(".practice_feedbackDiv").hide()
  })

}

// https://www.w3schools.com/js/js_validation.asp
// depth estimate is validated in html response div

function getResponse(){

  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".responseDiv").show();
    $(".practice_feedbackDiv").hide()


  })

}

function showFeedback(){
  console.log('show feedback')
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".responseDiv").hide();
    $(".practice_feedbackDiv").show();
    $(".green_fixationDiv").hide();
    $("#practice_feedback").show()

  })
  if (practice_trial==3 || practice_trial==6){
    if (document.getElementById("numb").value == 0){
        $("#practice_feedback").empty().append("<b>Correct! There was no target in the image.</b>");
        // $("#practice_feedback").append("<p>Correct!</p>");
    }
    else{
        $("#practice_feedback").empty().append("<b>Incorrect. There was no target in the image. Remember to respond '0' when there is no target in the image</b>");
        // $("#practice_feedback").append("<b>Incorrect. There was no target in the image. Remember to respond '0' when there is no target in the image</b>");
    }
  }

  else{
    $("#practice_feedback").empty().append("<b>Good job. </b>");
  
  }

}

function getAge(){

  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".responseDiv").hide();
    $(".practice_feedbackDiv").hide()
    $("#restart_trials").hide();
    $("#restartTrialsButton").hide();
    $("#age").show();


  })


}

function getTrialParams(){ // returns trial parameters to be logged 
  var stimulus = stim_seq[counter].image_path_target
  var duration = stim_seq[counter].duration 
  var actual_depth = stim_seq[counter].depth

  return [stimulus, duration, actual_depth];

}

function getAQ(){
  if (age_recorded == false){
    reported_age = document.getElementById("age_numb").value;
    reported_gender = document.getElementById("gender").value;
    console.log(reported_gender)
    saveTrialData();
    age_recorded = true
  }

  if (age_recorded == true){
    $("#age").hide() 
    $("#container-questionnaire").show();
    // $("#revealCodeButton").show();

  }

}

function lastInstructions(){ 
  if (age_recorded == false){
    reported_age = document.getElementById("age_numb").value;
    reported_gender = document.getElementById("gender").value;
    console.log(reported_gender)
    saveTrialData();
    age_recorded = true
  }

  if (age_recorded == true){
    $("#age").hide() 
    $("#container-questionnaire").hide();
    $("#lastBlockInstructions").append(
      "<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
      +"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
    $("#lastBlockInstructions").show();
    $("#revealCodeButton").show();

  }
 

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function endExperiment(){

  if (age_recorded == true){
    // gives participant their unique code and saves data to server --> this page should look identical to redirect html (revealCode.html)
    $("#lastBlockInstructions").append("<br><p style='text-align:center'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
    $("#revealCodeButton").hide();
    saveAllData();
  }
}

// ---------------------
// saving data functions
// ---------------------

function saveTrialData(){
  // at the end of each trial, appends values to data dictionary

  // global variables --> will be repetitive, same value for every row (each row will represent one trial)
  thisData["subjID"].push(subjID);
  thisData["workerId"].push(workerId);
  thisData["experimentName"].push("DepthScenes");
  thisData["versionName"].push("duration_manipulation_targetAtFixation");
  thisData["sequenceName"].push(sequenceName);
  thisData["url"].push(url);
  thisData["selected_row"].push(selected_row);
  thisData["windowWidth"].push($(window).width());
  thisData["windowHeight"].push($(window).height());
  thisData["screenWidth"].push(screen.width);
  thisData["screenHeight"].push(screen.height);
  thisData["startDate"].push(startDate);
  thisData["startTime"].push(startTime);
  thisData["unitSelection"].push(unit);

  // trial-by-trial variables, changes each time this function is called
  thisData["trial"].push(trial);
  thisData["stimulus"].push(stimulus);
  thisData["duration"].push(duration);
  thisData["actual_depth"].push(actual_depth);
  thisData["depth_estimate"].push(depth_estimate);
  thisData["trial_RT"].push(RT);
  thisData["log_sceneDuration"].push(log_sceneDuration);

}

function saveAllData() {
  // saves last pieces of data that needed to be collected at the end, and calls sendToServer function

  // add experimentTime and totalTime to data dictionary
  var experimentTime = (endExpTime - startExpTime);
  var totalTime = ((new Date()) - start);
  thisData["experimentTime"]=Array(trial).fill(experimentTime);
  thisData["totalTime"]=Array(trial).fill(totalTime);
  var age = reported_age;
  console.log('age', age)
  thisData["age"] = Array(trial).fill(age);
  thisData["gender"] = Array(trial).fill(reported_gender);
  thisData["seq_filepath"] = Array(trial).fill(seq_filepath);
  // change values for input divs to pass to php
  $("#experimentData").val(JSON.stringify(thisData));
  $("#completedTrialsNum").val(trial); //how many trials this participant completed

  sendToServer();
  console.log("save all data")
}

function sendToServer() {
  // send the data to the server as string (which will be parsed IN php)

  $.ajax({ //same as $.post, but allows for more options to be specified
    headers:{"Access-Control-Allow-Origin": "*", "Content-Type": "text/csv"}, //headers for request that allow for cross-origin resource sharing (CORS)
    type: "POST", //post instead of get because data is being sent to the server
    url: $("#saveData").attr("action"), //url to php
    data: $("#experimentData").val(),  

    // if it works OR fails, submit the form
    success: function(){
      document.forms[0].submit();
    },
    error: function(){
      document.forms[0].submit();
    }
  });
}

// ----------------------
// other random functions
// ----------------------

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}