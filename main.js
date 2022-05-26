kind = {
    "serve_submit": "發球",
    "serve_region_submit": "發球落點",
    "attack_submit": "攻擊",
    "attack_q_submit": "快攻",
    "attack_l_submit": "長攻",
    "attack_r_submit": "後排",
    "attack_region_submit": "攻擊落點",
    "defend_submit": "防守",
    "block_submit": "攔網",
    "set_submit": "舉球",
    "set_quality_submit": "球質"
}
choice = {
    "serve_submit": { "1": "站飄", "2": "跳飄", "3": "站扣", "4": "跳扣", "5": "失誤" },
    "serve_region_submit": { "region1": "區域1", "region2": "區域2", "region3": "區域3", "region4": "區域4", "region5": "區域5", "region6": "區域6", "region7": "區域7", "region8": "區域8", "region9": "區域9" },
    "attack_submit": { "1": "重扣", "2": "吊球", "3": "打手出界", "4": "失誤" },
    "attack_q_submit": { "position1": "位置1", "position2": "位置2", "position3": "位置3", "position4": "位置4", "position5": "位置5", "position6": "位置6" },
    "attack_l_submit": { "position1": "位置1", "position2": "位置2", "position3": "位置3", "position4": "位置4", "position5": "位置5", "position6": "位置6" },
    "attack_r_submit": { "position1": "位置1", "position2": "位置2", "position3": "位置3", "position4": "位置4", "position5": "位置5", "position6": "位置6" },
    "attack_region_submit": { "region1": "區域1", "region2": "區域2", "region3": "區域3", "region4": "區域4", "region5": "區域5", "region6": "區域6", "region7": "區域7", "region8": "區域8", "region9": "區域9" },
    "defend_submit": { "1": "非常好", "2": "好", "3": "普通", "4": "不好", "5": "非常不好" },
    "block_submit": { "1": "成功", "2": "失敗" },
    "set_submit": { "1": "主攻", "2": "快攻", "3": "舉對", "4": "後排", "5": "修正", "6": "吊球", "7": "二攻" },
    "set_quality_submit": { "1": "非常好", "2": "好", "3": "普通", "4": "不好", "5": "非常不好" }
}
serve_region = 0
attack_q_position = 0
attack_l_position = 0
attack_r_position = 0
attack_region = 0
current_game = "範例"

$(document).ready(function() {
    function findGames() {
        $.post('./game', {}, (data) => {
            if (data == [])
                $('select[name="game"]').html("<option>無比賽紀錄</option>")
            else {
                if (current_game == null)
                    $('select[name="game"]').html("<option selected disabled hidden>請選擇比賽</option>")
                else
                    $('select[name="game"]').html("<option selected disabled hidden>" + current_game + "</option>")
                data.forEach(function(v, i) {
                    $('select[name="game"]').append("<option>" + v.slice(0, -3) + "</option>")
                })
            }
        })
    }

    findGames()

    $("#game_submit").click((event) => {
        event.preventDefault()
        $.post('./new_game', {
            name: $('input[name="game"]').val(),
        }, (data) => {
            setTimeout(() => {
                $(`#game_ajax_output`).html("")
            }, 2000)
            if (data[0] == "Success") {
                $(`#game_ajax_output`).html(`<p><h2>新增成功（比賽：${data[1]}）</h2></p>`)
                findGames()
            } else
                $(`#game_ajax_output`).html(`<h2>${data}</h2>`)
            $(`input[name="game"]`).val("")
        })
    })

    $('select[name="game"]').on("change", function(e) {
        $.post('./select_game', {
            name: $('select[name="game"]').val(),
        }, (data) => {
            current_game = data
        })
    })

    $('#serve_region_form td').click(function(event) {
        event.preventDefault()
        if (serve_region != 0)
            $("." + serve_region).removeAttr("style")
        $(this).css("border", "3px solid red")
        serve_region = $(this).attr("class")
    })

    $('#attack_q_form td').click(function(event) {
        event.preventDefault()
        if ($(this).attr("class") != "position0") {
            if (attack_q_position != 0)
                $("." + attack_q_position).removeAttr("style")
            $(this).css("border", "3px solid red")
            attack_q_position = $(this).attr("class")
        }
    })

    $('#attack_l_form td').click(function(event) {
        event.preventDefault()
        if ($(this).attr("class") != "position0") {
            if (attack_l_position != 0)
                $("." + attack_l_position).removeAttr("style")
            $(this).css("border", "3px solid red")
            attack_l_position = $(this).attr("class")
        }
    })

    $('#attack_r_form td').click(function(event) {
        event.preventDefault()
        if ($(this).attr("class") != "position0") {
            if (attack_r_position != 0)
                $("." + attack_r_position).removeAttr("style")
            $(this).css("border", "3px solid red")
            attack_r_position = $(this).attr("class")
        }
    })

    $('#attack_region_form td').click(function(event) {
        event.preventDefault()
        if (attack_region != 0)
            $("." + attack_region).removeAttr("style")
        $(this).css("border", "3px solid red")
        attack_region = $(this).attr("class")
    })

    $('.open').click(function(event) {
        event.preventDefault()
        $("#" + $(this).attr("class").slice(5)).show()
    })

    $('.close').click(function(event) {
        event.preventDefault()
        $("#" + $(this).attr("class").slice(6)).hide()
    })

    $('input[name="ajax_round"]').on("click", function(e) {
        $.post('./player', {
            round: $('input[name="ajax_round"]:checked').val(),
        }, (data) => {
            if (data == [])
                $('select[name="number"]').html("<option>無選手紀錄</option>")
            else {
                $('select[name="number"]').html("<option selected disabled hidden>請選擇選手</option>")
                data.forEach(function(v, i) {
                    $('select[name="number"]').append("<option>" + v.player + "</option>")
                })
            }
            $('select[name="kind"]').html("<option>無類別紀錄</option>")
        })
    })

    $('select[name="number"]').on("change", function(e) {
        $.post('./kind', {
            round: $('input[name="ajax_round"]:checked').val(),
            player: $(this).val(),
        }, (data) => {
            if (data == [])
                $('select[name="kind"]').html("<option>無類別紀錄</option>")
            else {
                $('select[name="kind"]').html("<option selected disabled hidden>請選擇類別</option>")
                data.forEach(function(v, i) {
                    $('select[name="kind"]').append("<option>" + v.kind + "</option>")
                })
            }
        })
    })

    function drawChart() {
        $.post('./record', {
            round: $('input[name="ajax_round"]:checked').val(),
            player: $('select[name="number"]').val(),
            kind: $('select[name="kind"]').val(),
        }, (data) => {
            var choice = []
            var times = []
            data[0].forEach(function(v, i) {
                choice.push(v.choice)
                times.push(v.count)
            })
            const config = {
                type: 'pie',
                data: {
                    labels: choice,
                    datasets: [{
                        label: 'My First Dataset',
                        data: times,
                        backgroundColor: [
                            'rgb(255, 0, 0)',
                            'rgb(255 140 0)',
                            'rgb(255 255 0)',
                            'rgb(0, 255, 0)',
                            'rgb(0, 0, 255)',
                            'rgb(160 32 240)',
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    var label = context.label,
                                        currentValue = context.raw,
                                        total = context.chart._metasets[context.datasetIndex].total

                                    var percentage = parseFloat((currentValue / total * 100).toFixed(2))

                                    return label + ": " + currentValue + " (" + percentage + "%)"
                                }
                            }
                        }
                    }
                }
            };
            if (window.myChart instanceof Chart)
                window.myChart.destroy()
            window.myChart = new Chart(
                document.getElementById('myChart'),
                config
            );
            $('#ajax_output3').html(`<p>(比賽：${current_game}&emsp;局數：${data[1]}&emsp;選手：${data[2]}&emsp;類別：${data[3]})</p>`)
        })
    }

    $('select[name="kind"]').on("change", function(e) {
        drawChart()
    })

    $(".form_submit").click((event) => {
        event.preventDefault()
        id = event.target.id
        variable = {
            round: $('input[name="round"]:checked').val(),
            player: $('input[name="number"]').val(),
            kind: kind[id]
        }
        if (id == "serve_region_submit") {
            variable.choice = choice[id][serve_region]
            $("." + serve_region).removeAttr("style")
            serve_region = 0
        } else if (id == "attack_q_submit") {
            variable.choice = choice[id][attack_q_position]
            $("." + attack_q_position).removeAttr("style")
            attack_q_position = 0
        } else if (id == "attack_l_submit") {
            variable.choice = choice[id][attack_l_position]
            $("." + attack_l_position).removeAttr("style")
            attack_l_position = 0
        } else if (id == "attack_r_submit") {
            variable.choice = choice[id][attack_r_position]
            $("." + attack_r_position).removeAttr("style")
            attack_r_position = 0
        } else if (id == "attack_region_submit") {
            variable.choice = choice[id][attack_region]
            $("." + attack_region).removeAttr("style")
            attack_region = 0
        } else if ($(`#${id.slice(0, -7)}_form input[name="${id.slice(0, -7)}"]:checked`).val() == "0") {
            variable.choice = $(`input[name="${id.slice(0, -7)}_other"]`).val()
            $(`input[name="${id.slice(0, -7)}_other"]`).val("")
        } else
            variable.choice = choice[id][$(`#${id.slice(0, -7)}_form input[name="${id.slice(0, -7)}"]:checked`).val()]
        $.post('./update', variable, (data) => {
            setTimeout(() => {
                $(`#${id.slice(0, -7)}_ajax_output`).html("")
            }, 2000)
            if (data[0] == "Success") {
                $(`#${id.slice(0, -7)}_ajax_output`).html(`<p><h2>新增成功（局數：${data[1]}&emsp;選手：${data[2]}&emsp;類別：${data[3]}&emsp;選項：${data[4]}）</h2></p>`)
                drawChart()
            } else
                $(`#${id.slice(0, -7)}_ajax_output`).html(`<h2>${data}</h2>`)
            $(`#${id.slice(0, -7)}_form input[name="${id.slice(0, -7)}"]:checked`).attr('previousValue', false)
            $(`#${id.slice(0, -7)}_form input[name="${id.slice(0, -7)}"]:checked`).prop('checked', false)
        })
    })

    // $('#logout').click((event) => {
    //     event.preventDefault()
    //     $.post('./logout', (data) => {
    //         if (data == 'jump')
    //             window.location.href = '../html/login.html';
    //     });
    // })
});