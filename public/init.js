$('#progress_indicator').animate({width: '10%'}, 300);
var LocalDS = { set: function(key, value){ return localStorage.setItem(key, value);},
                get: function(key){return localStorage.getItem(key);},
                find: function(key){ return localStorage.hasOwnProperty(key);}
              };

var flag_task = new Flag();

var flag_view = new FlagView({ model: flag_task });

var Task = new Main();
var Task_view = new MainView({ model: Task });
$('#progress_indicator').animate({width: '30%'}, 300);

Task.fetch({ success: function(){
  $('#progress_indicator').animate({width: '50%'}, 300);
  Task_view.render();
} });

var CF = {
  submit: function(){ var data = $('.render_frame.current_task').contents().find('form').serializeObject(); Task_view.post_and_render(data); },
  skip_task: function(){ Task_view.skip(); },
  flag_task: function(){ flag_view.render(); }
};

Mousetrap.bind('alt+f', function() { CF.flag_task(); });
Mousetrap.bind('alt+s', function() { CF.skip_task(); });

$('#skip_link, #time_over_next').live('click',function(){ $.facebox.close(); CF.skip_task(); });
$('#continue').live('click',function(){
  $.facebox.close();
  Task_view.flip_frame();
  Task_view.next_task();
});
$('#flag_link').click(function(){ CF.flag_task(); });

$('#flag_form').live('submit',function(e){
  e.preventDefault();
  var reason = $(this).find('#flag_reason').val();
  flag_task.set('reason', reason);
  $('#flag_form')[0].reset();
  $.facebox.close();
  flag_task.set('assignment_id', Task_view.current.meta.assignment_id);
  flag_task.save();
  CF.skip_task();
});