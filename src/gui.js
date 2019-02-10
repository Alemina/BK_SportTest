import $ from "jquery";
export default function guiActions() {
    return {
        setBreaksOff() {
            $("#break-row").addClass("hide");
            $('#break_btn').text('Włącz przerwy');
            $('#break_btn').blur();
        },
        setBreaksOn() {
            $("#break-row").removeClass("hide");
            $('#break_btn').text('Wyłącz przerwy');
            $('#break_btn').blur();
        },
        setTestOn() {
            $('#start_btn').removeClass('btn-success');
            $('#start_btn').addClass('btn-danger');
            $('#start_btn').text('Stop');
            $('#start_btn').blur();

            $('#break_btn').addClass('hide');
            $('select').addClass('hide');
            $("#meters").text('0');
        },
        setTestOff() {
            $('#start_btn').removeClass('btn-danger');
            $('#start_btn').addClass('btn-success');
            $('#start_btn').text('Start');
            $('#start_btn').blur();

            $('#break_btn').removeClass('hide');
            $('select').removeClass('hide');
            $('#current-stage').text('---');
            $("#meters").text('---')
        },
        onChangeBeginStage() {
            $('select').blur();
        },
        setCurrentStage(stage) {
            $("#current-stage").text(`${stage} z 18`);
        },
        add10Meters() {
            $("#meters").text( parseInt($("#meters").text()) + 10 );
        }
        

    }
}