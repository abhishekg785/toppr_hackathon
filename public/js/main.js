/*
*  author : abhishek goswami
*  abhishekg785@gmail.com
*  github : abhishekh785
*
*  main.js : to manipulate data in the DOM
*/

(function($, d){
  var searchForm = $("#searchForm"),
      queryString = $("#queryString"),
      BattleIdArr = [],
      BattleNameArr = [],
      BattleYearArr = [],
      BattleNumberArr = [],
      AttackerKingArr = [],
      DefenderKingArr = [],
      AttackersArr = [],
      DefendersArr = [],
      AttackerOutcomeArr = [],
      BattleTypeArr = [],
      MajorDeathArr = [],
      MajorCaptureArr = [],
      AttackerSizeArr = [],
      DefenderSizeArr = [],
      AttackerCommanderArr = [],
      DefenderCommanderArr = [],
      SummerArr = [],
      LocationArr = [],
      RegionArr = [],
      NoteArr = [],
      dataView = $("#dataView ul"),
      dataInfo = $('#dataInfo'),
      loader = $('#loader');

  var Functions = {

    //ajax request to get the list of all the battles along with infos
    getList : function(){
      $.ajax({
        url : 'http://localhost:3000/search-panel/api/v0.1/list',
        type : 'GET',
        success : function(data){
          var parsedData = JSON.parse(data);
          console.log(parsedData);
          Functions.setData(parsedData).populateDataInDOM();
        },
        error : function(err){
          console.log(err);
        }
      });
    },

    //using search api by ajax request to get the battle info on the basis of king, region, year etc.
    searchByAJAX : function(postData){
      $.ajax({
        url : 'http://localhost:3000/search-panel/api/v0.1/search',
        type : 'POST',
        data : postData,
        success : function(data){
          Functions.setSearchResultINDOM(postData, data).hideLoader();
        },
        error : function(err){
          console.log(err);
        }
      });
    },

    // set data to the array variables to make the page SPA to improve the UX better and store the info at once.
    setData : function(parsedData){
      for(var i = 0; i< parsedData.length; i++){
        var attackers = [];
        var defenders = [];
        BattleIdArr.push(parsedData[i].id);
        BattleNameArr.push(parsedData[i].name);
        BattleYearArr.push(parsedData[i].year);
        BattleNumberArr.push(parsedData[i].battle_number);
        AttackerKingArr.push(parsedData[i].attacker_king);
        DefenderKingArr.push(parsedData[i].defender_king);
        if(parsedData[i].attacker_1 != ''){
          attackers.push(parsedData[i].attacker_1);
        }
        if(parsedData[i].attacker_2 != ''){
          attackers.push(parsedData[i].attacker_2);
        }
        if(parsedData[i].attacker_3 != ''){
          attackers.push(parsedData[i].attacker_3);
        }
        if(parsedData[i].attacker_4 != ''){
          attackers.push(parsedData[i].attacker_4);
        }
        if(parsedData[i].defender_1 != ''){
          defenders.push(parsedData[i].defender_1);
        }
        if(parsedData[i].defender_2 != ''){
          defenders.push(parsedData[i].defender_2);
        }
        if(parsedData[i].defender_3 != ''){
          defenders.push(parsedData[i].defender_3);
        }
        if(parsedData[i].defender_4 != ''){
          defenders.push(parsedData[i].defender_4);
        }
        AttackersArr.push(attackers);
        DefendersArr.push(defenders);
        AttackerOutcomeArr.push(parsedData[i].attacker_outcome);
        BattleTypeArr.push(parsedData[i].battle_type);
        MajorDeathArr.push(parsedData[i].major_death);
        MajorCaptureArr.push(parsedData[i].major_capture);
        AttackerSizeArr.push(parsedData[i].attacker_size);
        DefenderSizeArr.push(parsedData[i].defender_size);
        AttackerCommanderArr.push(parsedData[i].attacker_commander);
        DefenderCommanderArr.push(parsedData[i].defender_commander);
        SummerArr.push(parsedData[i].summer);
        LocationArr.push(parsedData[i].location);
        RegionArr.push(parsedData[i].region);
        NoteArr.push(parsedData[i].note);
      }
      console.log(BattleIdArr);
      return Functions;
    },

    //populate the received data in the DOM.
    populateDataInDOM : function(){
      if(BattleNameArr.length > 0){
        for(var i = 0 ; i< BattleNameArr.length; i++){
          var item = '<li class = "battleName" id = "'+ BattleIdArr[i] +'">'+ BattleNameArr[i] +'</li>';
          dataView.append(item);
        }
        Functions.addClickEventToBattleName().hideLoader();
      }
      else{
        var item = 'No such item found';
        dataView.append(item);
      }
      return Functions;
    },

    //populate the result obtained from the search api into the DOM.
    setSearchResultINDOM : function(postData, data){
      dataView.empty();
      dataView.append('<h2>Search results for "'+ postData.queryString +'" under "'+ postData.queryFor +'"</h2>');
      if(data.length > 0){
        for(var i =0 ; i < data.length; i++){
          var item = '<li id = "' + data[i].id + '" class = "battleName">'+ data[i].name +'</li>';
          // var item = '<li class = "battleName" id = "'+ BattleIdArr[i] +'">'+ BattleNameArr[i] +'</li>';
          dataView.append(item);
        }
        Functions.addClickEventToBattleName().hideLoader();
      }
      else{
        var item = 'No such data Found';
        dataView.append(item);
      }
      return Functions;
    },

    addClickEventToBattleName : function(){
      $('.battleName').on('click', function(){
        $('#dataInfo').show().empty();
        var battleId = this.id;
        var index = BattleIdArr.indexOf(Number(battleId));    //now get all the info from the array at the index
        var item =  '<h1>'+ BattleNameArr[index] +'</h1>' +
                    '<u>Year</u> : '+ BattleYearArr[index] + '<br/>' +
                    'Battle No : ' + BattleNumberArr[index] + '<br/>' +
                    'Attacker King : ' + AttackerKingArr[index] + '<br/>' +
                    'Defender King : ' + DefenderKingArr[index] + '<br/>' +
                    'Attackers : ' + AttackersArr[index] + '<br/>' +
                    'Defenders : ' + DefendersArr[index] + '<br/>' +
                    'Attackers Outcome : ' + AttackerOutcomeArr[index] + '<br/>' +
                    'Battle Type : ' + BattleTypeArr[index] + '<br/>' +
                    'Major Death : ' + MajorDeathArr[index] + '<br/>' +
                    'Major Capture : ' + MajorCaptureArr[index] + '<br/>' +
                    'Attacker Size : ' + AttackerSizeArr[index] + '<br/>' +
                    'Defender Size : ' + DefenderSizeArr[index] + '<br/>' +
                    'Attacker Commander : ' + AttackerCommanderArr[index] + '<br/>' +
                    'Defender Commander :' + DefenderCommanderArr[index] + '<br/>' +
                    'Summer : ' +  SummerArr[index] + '<br/>' +
                    'Location : ' + LocationArr[index] + '<br/>' +
                    'Region : ' + RegionArr[index] + '<br/>' +
                    'Note : ' + NoteArr[index] ;
        dataInfo.append(item);
      });
      return Functions;
    },

    //to show the loader while data is being fetched
    showLoader : function(){
      loader.show();
      return Functions;
    },

    //to hide the loader when data has been fetched
    hideLoader : function(){
      loader.hide();
    }
  }

  $(d).ready(function(){

    //as soon as the page loads , send the ajax request to the list api and get the data
    Functions.showLoader().getList();

    searchForm.on('submit', function(e){
      e.preventDefault();
      $('#dataInfo').empty();
      var postData = {
        queryString : queryString.val(),
        queryFor : d.querySelector('input[name="queryFor"]:checked').value
      }
      Functions.showLoader().searchByAJAX(postData);
    });
  });

})(jQuery, document);
