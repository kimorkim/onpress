/**
 * 
 * 기본 영역
 * 
 * @module functionSet
 * 
 */

/**
 * HTML5의 내부 스토리지를 지원하는 전역 객체.
 * 
 * @class Storage
 * @static
 */
var stor = (function() {
    var my = {};

    /**
     * 세션 스토리지에 정보를 저장 한다.
     * 
     * @method setSessionData
     * @param {String}
     *            key 접근할 스토리지의 키 값.
     * @param {String}
     *            value 저장할 스토리지의 벨류 값.
     * 
     */
    my.setSessionData = function(key, value) {
        if (typeof value === "object") {
            value = JSON.stringify(value)
        }
        sessionStorage.setItem(key, value);
    };

    /**
     * 세션 스토리지에 정보를 읽어서 리턴 한다.
     * 
     * @method getSessionData
     * @param {String}
     *            key 접근할 스토리지의 키 값.
     * @param {BOOLEAN}
     *            valid 스토리지의 데이터 유지 여부(true = 삭제, false = 유지).
     * @returns {String | JSON} 저장된 String 또는 JSON 오브젝트는 리턴한다.
     * 
     */
    my.getSessionData = function(key, valid) {
        var result = sessionStorage.getItem(key), ret_obj = "";

        if (valid == true)
            sessionStorage.removeItem(key);
        try {
            ret_obj = JSON.parse(result);
            return ret_obj;
        } catch (e) {
            return result;
        }
    };

    /**
     * 세션 스토리지에서 해당하는 키를 찾아 제거한다.
     * 
     * @method removeSessionData
     * @param {String}
     *            key 접근할 스토리지의 키 값.
     * 
     */
    my.removeSessionData = function(key) {
        sessionStorage.removeItem(key);
    };

    /**
     * 로컬 스토리지에 정보를 저장 한다.
     * 
     * @method setLocalData
     * @param {String}
     *            key 접근할 스토리지의 키 값.
     * @param {String}
     *            value 저장할 스토리지의 벨류 값.
     * 
     */
    my.setLocalData = function(key, value) {
        if (typeof value === "object") {
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value);
    }

    /**
     * 로컬 스토리지에 정보를 읽어서 리턴 한다.
     * 
     * @method getLocalData
     * @param {String}
     *            key 접근할 스토리지의 키 값.
     * @param {String}
     *            def 값이 존재하지 않을 경우 자동으로 매칭해서 가져올 값.
     * @param {BOOLEAN}
     *            valid 스토리지의 데이터 유지 여부(true = 삭제, false = 유지).
     * @returns {String | JSON} 저장된 String 또는 JSON 오브젝트는 리턴한다.
     * 
     */
    my.getLocalData = function(key, def, valid) {
        var result = localStorage.getItem(key), ret_obj;
        if (valid == true) {
            localStorage.removeItem(key);
        }
        if (!result) {
            return def;
        }
        try {
            ret_obj = JSON.parse(result);
            return ret_obj;
        } catch (e) {
            return result;
        }
    }

    /**
     * 로컬 스토리지에서 해당하는 키를 찾아 제거한다.
     * 
     * @method removeLocalData
     * @param {String}
     *            key 접근할 스토리지의 키 값.
     * 
     */
    // 로컬 스토리지 삭제
    my.removeLocalData = function(key) {
        localStorage.removeItem(key);
    }

    /**
     * 웹 DB를 생성 또는 불러 오는 메소드
     * 
     * @method getDataBase
     * @param {JSON}
     *            param name, ver, caption의 3가지 형태의 값.
     * @returns {DB OBJECT} HTML5의 DB OBJECT가 리턴된다.
     * 
     */
    // 웹DB 열기 (없으면 생성)
    my.getDataBase = function(param) {
        var name = param.name || "", ver = param.ver || "", caption = param.caption || "", db_obj;

//        db_obj = openDatabase(name, ver, caption, 2);
        return db_obj;
    };

    /**
     * private DB 생성 오브젝트
     * 
     * @property database
     * @type WebSql
     * 
     */
    var database = my.getDataBase({
        "name" : "szdb",
        "ver" : "0.1",
        "caption" : "smart zone 디비"
    });

    /**
     * 단순 한 SQL 문장을 받아서 DB처리 하는 메소드.
     * 
     * @method execDataBase
     * @param {String}
     *            sql_string SQLITE SQL 쿼리 문.
     * @param {FUNCTION}
     *            callback 함수 수행후 RESULT를 받아 실행 될 콜백 함수
     * 
     */
    // 웹DB 실행
    my.execDataBase = function(sql_string, callback) {
        if (!callback) {
            log.e(TAG, "DB 쿼리 뒤에 반드시 CallBack이 있어야 합니다.");
            return;
        }
        ;
        database.transaction(function(tx) {
            tx.executeSql(sql_string, [], function(tx, rs) {
                var rows = rs.rows, i, max, row_array = [];

                for (i = 0, max = rows.length; i < max; i++) {
                    row_array.push(rows.item(i));
                }

                if (callback) {
                    callback(row_array);
                }
            }, function(a, b, c, d) {
                if (callback) {
                    callback([]);
                }
            });
        });
    };

    /**
     * SQL쿼리문을 배열로 받아서 전부 처리 한후 콜백을 실행 시키는 메소드.
     * 
     * @method execRepeatSqlDataBase
     * @param {ARRAY}
     *            Data SQLITE SQL 쿼리 문 Array String(반드시 배열이어야 한다). <br>
     *            Length가 0이면 null 리턴됨.
     * @param {FUNCTION}
     *            callback 성공시 마지막 Count 값을 받은 후 수행될 콜백 함수.
     * @param {FUNCTION}
     *            failure 에러 발생시 에러 코드를 받아을 콜백 함수.
     * 
     */
    // 반복 다중 쿼리 실행
    my.execRepeatSqlDataBase = function(Data, callback, failure) {
        if (Data.length === 0) {
            callback();
            return;
        }
        database.transaction(function(tx) {
            for ( var i = 0, max_item = Data.length; i < max_item; i++) {
                (function() {
                    var k = i;
                    var sql = Data[i];
                    tx.executeSql(sql, [], function(tx, rs) {
                        if (k === max_item - 1) {
                            callback(max_item);
                        }
                    }, function(a, b) {
                        if (failure) {
                            failure(a, b, sql);
                        }
                    });
                })(i, Data[i]);
            }
        });
    };

    /**
     * 테이블 이름과 JSON Object를 받아서 테이블을 생성하는 메소드.<br>
     * 이미 테이블이 존재 하면 추가로 생성하지 않는다.
     * 
     * @method createTable
     * @param {String}
     *            tablename 생성할 테이블 이름 값.
     * @param {JSON}
     *            data 테이블에 들어갈 필드명<br>
     *            {key:value} 형태의 JSON을 받아서 Key값 으로 필드 명을 정한다.
     * @param {FUNCTION}
     *            callback 생성 완료 후 실행 될 콜백 함수.
     * 
     */
    // 웹DB 테이블 생성
    my.createTable = function(tablename, data, callback) {
        database.transaction(function(tx) {

            var sql, sql_arr = [], i;

            sql = "CREATE TABLE IF NOT EXISTS " + tablename + " (";
            for (i in data) {
                sql_arr.push(i + " VARCHAR(255)");
            }
            sql += sql_arr.join(",");
            sql += ")";

            tx.executeSql(sql, [], function() {
                if (callback)
                    callback();
            });
        });
    };

    /**
     * 테이블 이름을 받아서 테이블을 삭제하는 메소드.<br>
     * 이미 테이블이 존재 하지 않으면 추가로 삭제하지 않는다.
     * 
     * @method dropTable
     * @param {String}
     *            tablename 삭제 할 테이블 이름 값.
     * @param {FUNCTION}
     *            callback 삭제 완료 후 실행 될 콜백 함수.
     * 
     */
    // 웹DB 테이블 제거
    my.dropTable = function(tablename, callback) {
        database.transaction(function(tx) {

            var sql;
            sql = "DROP TABLE IF EXISTS " + tablename;
            tx.executeSql(sql, [], function() {
                if (callback)
                    callback();
            });
        });
    };

    /**
     * 테이블 이름을 받아서 테이블 내의 레코드를 전부 삭제하는 메소드.<br>
     * 
     * @method deleteDataBase
     * @param {String}
     *            tablename 레코드를 삭제 할 테이블 이름 값.
     * @param {FUNCTION}
     *            callback 레코드 삭제 완료 후 실행 될 콜백 함수.
     * 
     */
    // 웹DB delete
    my.deleteDataBase = function(tablename, callback, data, field) {
        database.transaction(function(tx) {

            var sql, sb;
            sql = "delete from " + tablename;

            if (data) {

                if (!Array.isArray(data)) {
                    data = [ data ];
                }

                for (j = 0; j < data.length; j++) {

                    sb = sql + " where " + field + " = '" + data[j][field] + "'";

                    console.log(sb);
                    (function() {
                        var k = j;

                        tx.executeSql(sb, [], function() {
                            if (k === data.length - 1) {
                                if (callback) {
                                    callback(true);
                                }
                            }
                        }, function(a, b) {
                            // alert(JSON.stringify(b));
                        });
                    })(j);
                }

            } else {
                tx.executeSql(sql, [], function() {
                    if (callback)
                        callback();
                });
            }
        });
    };

    /**
     * 테이블 이름과 데이터를 받아서 테이블 내의 레코드를 삽입 하는 메소드.
     * 
     * @method insertDataBase
     * @param {String}
     *            tablename 레코드를 삽입 할 테이블 이름 값.
     * @param {JSON}
     *            data 레코드를 삽입 할 JSON(Array) 형태의 데이터 값.
     * @param {FUNCTION}
     *            callback 레코드 삽입 완료 후 실행 될 콜백 함수.
     * 
     */
    // 웹DB insert
    my.insertDataBase = function(tablename, data, callback) {
        database.transaction(function(tx) {
            var arr_field = [], arr_value = [], arr_data_set = [], sb2, sb = "insert into ", i, j;
            sb += tablename;
            sb += "( ";

            if (!Array.isArray(data)) {
                data = [ data ];
            }

            for (i in data[0]) {
                arr_field.push(i);
                arr_value.push("?");
            }
            sb += arr_field.join(",");
            sb += ") ";
            sb += " values(";
            sb += arr_value.join(",");
            sb += ") ";

            for (j = 0; j < data.length; j++) {
                if ($.isEmptyObject(data)) {
                    continue;
                }
                arr_data_set = [];
                for (i in data[j]) {
                    arr_data_set.push(data[j][i]);
                }
                // console.log(arr_data_set);
                (function() {
                    var k = j;

                    tx.executeSql(sb, arr_data_set, function() {
                        if (k === data.length - 1) {
                            if (callback)
                                callback(true);
                        }
                    });
                })(j);
            }
        });
    };

    /**
     * 테이블 이름과 데이터, 조건문을 받아서 테이블 내의 레코드를 업데이트 하는 메소드.
     * 
     * @method updateDataBase
     * @param {String}
     *            tablename 레코드를 업데이트 할 테이블 이름 값.
     * @param {JSON}
     *            data 레코드를 업데이트 할 JSON(Array) 형태의 데이터 값.
     * @param {String}
     *            data 레코드를 업데이트 대상을 지정하는 where 조건 문.
     * @param {FUNCTION}
     *            callback 레코드 업데이트 완료 후 실행 될 콜백 함수.
     * 
     */
    // 웹DB update
    my.updateDataBase = function(tablename, data, where, callback) {
        database.transaction(function(tx) {
            var update_sql = [], sb2, sb = "update ", i, j;
            sb += tablename;
            sb += " SET ";

            if (!Array.isArray(data)) {
                data = [ data ];
            }

            for (j = 0; j < data.length; j++) {
                update_sql = [];
                for (i in data[0]) {
                    update_sql.push(i + " = '" + data[j][i] + "'");
                }
                sb += update_sql.join(", ") + where;

                (function() {
                    var k = j;

                    tx.executeSql(sb, [], function() {
                        if (k === data.length - 1) {
                            if (callback) {
                                callback(true);
                            }
                        }
                    }, function(a, b) {
                        // alert(JSON.stringify(b));
                    });
                })(j);
            }
        });
    };

    /**
     * 이미 만들어진 JSON데이터 안에 추가적으로 DB를 검색한 후 값을 추가하는 형태의 메소드.<br>
     * ex) 서버에서 코드값을 받고 코드 명을 내부 DB에서 찾아서 포함 후 다시 리턴<br>
     * 복잡도가 높고 성능이 좋지 못하므로 사용을 자제.
     * 
     * @method pushDataBase
     * @param {JSON}
     *            param 원본 데이터가 들어 있는 JSON 데이터.
     * @param {JSON}
     *            map 원본 데이터의 Key을 가지고 있는 데이터.
     * @param {String}
     *            sql 데이터를 조회 하는 SQL문.
     * @param {FUNCTION}
     *            callback 모든 수행 완료 후 합쳐진 데이터를 포함 후 실행되는 콜백 함수.
     * 
     */
    // 웹DB 실행후 data 넣기
    my.pushDataBase = function(param, map, sql, callback) {
        database.transaction(function(tx) {
            var i, j, max, sql_string, result = [];
            sql += " where ";
            for (i = 0, max = param.length; i < max; i++) {
                for (j in map) {
                    sql_string = sql + map[j][0] + "='" + param[i][j] + "'";
                    (function() {
                        var k = i;
                        var q = j;
                        tx.executeSql(sql_string, [], function(tx, rs) {
                            try {
                                param[k][map[q][1]] = rs.rows.item(0)[map[q][1]];
                            } catch (e) {
                                param[k][map[q][1]] = "";
                            }

                            if (k === (max - 1)) {
                                callback(param);
                            }
                        });
                    })(i, j);
                }
            }
        });
    };

    /**
     * 테이블 이름을 받아서 그 이름의 테이블이 존재 하는지 확인 하는 메소드
     * 
     * @method isTable
     * @param {String}
     *            tablename 확인 할 테이블 이름
     * @param {FUNCTION}
     *            callback 테이블을 확인 한수 실행되는 콜백 함수.<br>
     *            만약에 테이블이 있다면 RESULT에 숫자가 1이상 들어 간다. 0 이면 테이블 없음.
     * 
     */
    my.isTable = function(tablename, callback) {
        var sql = "SELECT count(*)as cnt FROM sqlite_master " + "WHERE type = 'table' AND name = '" + tablename + "' ";
        database.transaction(function(tx) {
            tx.executeSql(sql, [], function(tx, rs) {
                var rows = rs.rows;
                for ( var i = 0; i < rows.length; i++) {
                    var row = rows.item(i);
                    var check = (row.cnt > 0) ? true : false;
                    callback(check);
                }
            });
        });
    }
    
    /**
     * SQL파일 임포트 해서 테이블 생성
     * 
     * @method createAllTable
     * @param {String}
     *            location 임포트할 파일의 위치
     * @param {String}
     *            [div] 각 SQL 명령어 구분자 (기본값 --div--)
     * 
     */
    my.createAllTable = function(location, div) {
        var div_spell = div ? div : "--div--";
        var sql = AJAX.Request(location).split(div_spell);
        database.transaction(function(tx) {
            for ( var i = 0; i < sql.length; i++) {
                tx.executeSql(sql[i], []);
            }
        });
    }
    

    return my;
})();

/**
 * 자주 사용되는 공통 함수들의 전역객체(유틸리티).
 * 
 * @class Util
 * @static
 */
var util = (function() {
    /** UTIL 내부 네임스페이스 */
    var my = {};
    
    /**
     * Private 현재 날짜 저장공간
     * 
     * @property now_date
     * @type Date
     * @default undefined
     * 
     */
    var now_date;
    
    /**
     * !!!테스트용!!!<br>
     * GCM을 자바스크립트로 보내기 위한 메소드.<br>
     * API_KEY를 등록해 주어야 한다.(Authorization)
     * 
     * @method gcmsender
     * @param {JSON ||
     *            NVP} param GCM서버에 보낼 파라미터<br>
     *            JSON데이터나 NVP형식의 텍스트가 가능하다.<br>
     *            registration_id 또는 registration_ids를 반드시 적어주어야 함.
     * 
     */
    my.gcmsender = function(param) {
        //    
        var p = "data.msg=안녕안녕안녕안녕안녕안&data.title=abc&data.ticker=bbbbb&registration_id=APA91bHY1OMv9p7dVYN0DzOS0Uj8Z9ZfHV8wQ1Y_uAfZBhNE5V1egGALJlRlN_RZe_soRC6D1nnTFKqh2A6eKTxfnTULChJZXKu3rOh2S9ZOyNSEG9DHWXJ5O456vtCoBRQH8Ll1m9S9P0paltYr7EIG_iv9X9I2Zg";

        $.ajax({
            'url' : "https://android.googleapis.com/gcm/send",
            'type' : 'post',
            'cache' : false,
            'contentType' : "application/x-www-form-urlencoded",
            'headers' : {
                "Authorization" : "key=API키",
                "charset" : "UTF-8",
                "Content-length" : encodeURI(p).length
            },
            'dataType' : "html",
            'crossDomain' : true,
            'data' : encodeURI(p),
            'success' : function(data) {
                console.log('ajax::success');
                console.log(data);
            },
            'error' : function(xhr, textStatus, errorThrown) {
                console.log('ajax::fail');
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    /**
     * AJAX통신용 메소드.<br>
     * API_KEY를 등록해 주어야 한다.(Authorization)
     * 
     * @method ajax
     * @param {JSON}
     *            param AJAX통신용 파라미터
     * 
     */
    my.ajax = function(param, async) {
        var result = null;
        if (async){
            async = true;
        }
        else {
            async = false;
        }
        $.ajax({
            'url' : param.url,
            'async' : async,
            'type' : param.type || 'get',
            'cache' : param.cache || false,
            'contentType' : param.contentType || "application/json",
            'headers' : {
                "charset" : "UTF-8"
            },
            'dataType' : param.dataType || "json",
            'crossDomain' : param.crossDomain || true,
            'data' : encodeURI(param.data || ""),
            'success' : function (data) {
                result = data;
                if(param.success) {
                    param.success(data);
                }
            },
            'error' : function (event, data) {
                result = data;
                if(param.success) {
                    param.success(data);
                }
            }
        });
        
        return result;
    }
    
    /**
     * 한국 현재 시간 구하기
     * 
     * @method getKoreaTime
     * @returns {Date} 한국날짜
     * 
     */
    // 한국 현재 시간 구하기
    my.getKoreaTime = function() {
        var today = new Date();
        var pcOffset = (today.getTimezoneOffset()/60);  
        today.setHours(today.getHours() + pcOffset);
        today.setHours(today.getHours() + 9);
        return today;
    };

    /**
     * Float 더하기 함수 (소수점 2째자리까지 표시)
     * 
     * @method addFloat
     * @param {Float}
     *            arguments 더하고 싶은 float값들
     * 
     */
    // Float 더하기 함수
    my.addFloat = function() {
        var count = arguments.length;
        var result = 0;
        for(var i = 0; i < count; i++){
            if(!$.isArray(arguments[i])) {
                result += parseFloat(arguments[i]);
            } else {
                $.each(arguments[i], function (idx, val) {
                    result += parseFloat(val);
                });
            }
        }
        return result.toFixed(2);
    };
    
    /**
     * 배열을 받아서 인덱스 부분의 값만 잘라서 리턴해주는 메소드.
     * 
     * @method arrayRemoveItem
     * @param {Array}
     *            data 특정 부분을 제거 하고 싶은 배열 값.
     * @param {Number}
     *            idx 잘라 내고 싶은 특정 배열의 인덱스 값.
     * 
     */
    // 배열 특정 인덱스 삭제
    my.arrayRemoveItem = function(data, idx) {
        var data_length = data.length;
        var result = [];

        if (data_length <= idx) {
            result = data.slice(0, idx - 1);
        } else {
            result = data.slice(0, idx);
            result = result.concat(data.slice(idx + 1));
        }
        return result;
    };

    /**
     * 전화번호를 받아서 XXX-XXXX-XXXX의 형태로 바꿔 주는 메소드.<br>
     * 지원되는 전화번호 형식<br>
     * 서울 : 02-XXXX-XXXX<br>
     * 핸드폰 : 01X-XXXX-XXXX<br>
     * 인터넷 전화 : 07X-XXXX-XXXX<br>
     * 대표번호 : 15XX-XXXX<br>
     * 국제전화 서울 : +822-XXXX-XXXX<br>
     * 국제전화 기타 : +82XX-XXXX-XXXX<br>
     * 기타 국선 : XXX-XXXX-XXXX
     * 
     * @method phoneFormat
     * @param {Number |
     *            String} phone_num 포메팅 하고 싶은 전화번호.
     * @returns {String} 포메팅된 전화번호.<br>
     *          ex) 03112345678 => 031-1234-5678 <br>
     *          ex) 0212345678 => 02-1234-5678
     * 
     */
    // 전화번호 변환
    my.phoneFormat = function(phone_num) {
        var ret_num = phone_num.replace(/-/g, "");
        ret_num = ret_num.replace(/(^02.{0}|^01.{1}|^07.{1}|^15.{2}|^\+822|^\+820.{2}|^\+82.{2}|[0-9]{3})([0-9]*)([0-9]{4})/, "$1-$2-$3");
        ret_num = ret_num.replace(/--/g, "-");
        return ret_num;
    };

    /**
     * yyyyMMdd 형식의 날짜를 인자로 받아 MM-dd 형식으로 리턴 하는 메소드.
     * 
     * @method getMonthDay
     * @param {String}
     *            date yyyyMMdd 형식의 날짜
     * @returns {String} MM-dd 형식의 날짜
     * 
     */
    // 날짜 월-일 만 표시
    my.getMonthDay = function(date) {
        return date.substring(4, 6) + "-" + date.substring(6, 8);
    }

    /**
     * 현재 페이지의 ID값을 가져오는 메소드. ※주의 사항 ※ - 페이지가 로딩되기 전에 사용하면 오동작을 일으킴.
     * 
     * @method getNowPage
     * @returns {String} 현재 PAGE의 ID
     * 
     */
    // 현재 페이지 아이디 가져오기
    my.getNowPage = function() {
        return $(".ui-page-active")[0].id;
    }

    /**
     * 문자열 또는 숫자를 받아서 숫자인지 판단하는 메소드<br>
     * 
     * @method checkNumber
     * @param {String |
     *            Number} string 숫자인지 판별할 인자.
     * @returns 숫자면 true를 리턴<br>
     *          숫자가 아니면 "" 빈스트링 리턴
     * 
     */
    // 숫자 판별
    my.checkNumber = function(string) {
        var regexec = /[0-9]/;
        return regexec.test(string);
    }

    /**
     * 
     * yyyyMM형식의 날짜 값을 받고, 숫자를 받아서 숫자만큼 월을 빼서 계산해주는 메소드.
     * 
     * @method subMonth
     * @param {String |
     *            Number} date yyyyMM 형식의 날짜 테이터.
     * @param {Number}
     *            num 빼고싶은 만큼의 월단위 숫자.
     * @returns {String} date 값에서 num만큼 뺀 yyyyMM의 값을 리턴.<br>
     *          ex) 201209 - 3 = 201206 ex) 201209 - 12 = 201109
     * 
     */
    // 지정한 수만큼 -한 월 계산 (MM형식의 월이 들어와야함.)
    my.subMonth = function(Date, num) {
        var Year = parseInt(Date.substring(0, 4), 10);
        var Month = parseInt(Date.substring(4, 6), 10);
        var temp;
        var i = 1;
        if ((Month - num) < 1) {
            Year -= Math.ceil((num + 1 - Month) / 12);
            while (true) {
                temp = (Month - num + (12 * i)) * 1;
                i++;
                if (temp >= 1) {
                    break;
                }
            }
            Month = temp;
        } else
            Month -= num;
        return Year + my.zeroFiller(2, Month);
    }

    /**
     * 
     * yyyyMM형식의 날짜 값을 받고, 숫자를 받아서 숫자만큼 월을 더해서 계산해주는 메소드.
     * 
     * @method addMonth
     * @param {String |
     *            Number} date yyyyMM 형식의 날짜 테이터.
     * @param {Number}
     *            num 더하고싶은 만큼의 월단위 숫자.
     * @returns {String} date 값에서 num만큼 더한 yyyyMM의 값을 리턴.<br>
     *          ex) 201209 + 3 = 201212 ex) 201209 + 12 = 201309
     * 
     */
    // 지정한 수만큼 +한 월 계산 (MM형식의 월이 들어와야함.)
    my.addMonth = function(Date, num) {
        var Year = parseInt(Date.substring(0, 4), 10);
        var Month = parseInt(Date.substring(4, 6), 10);
        if ((Month + num) > 12) {
            Year += Math.ceil(num / 12);
            Month = ((Month + num) - 12) % 12;
        } else
            Month += num;
        return "" + Year + my.zeroFiller(2, Month);
    }

    /**
     * 
     * yyyyMMdd형식의 날짜 값을 받고, 숫자를 받아서 숫자만큼 일을 빼서 계산해주는 메소드.
     * 
     * @method subDay
     * @param {String | Number} date yyyyMMdd 형식의 날짜 테이터.
     * @param {Number} num 빼고싶은 만큼의 일단위 숫자.
     * @param {Number} type type에 dateType가 들어오면 yyyyMMdd의 값을 리턴, <br>
     *                      아니라면 long date 타입으로 리턴
     * @returns {String} date 값에서 num만큼 뺀 yyyyMMdd의 값을 리턴.
     * 
     */
    // 지정한 수만큼 +한 일 계산 (YYYYMMDD형식의 날짜가 들어와야함.)
    my.subDay = function(Date, num, type) {
        var calc_date;
        if (String(date).length === 13) {
            calc_date = new Date(date).getTime() - (num * 86400000);
        } else {
            calc_date = new Date(my.dateFormat(date)).getTime() - (num * 86400000);
        }

        if (type === "dateType") {
            calc_date = new Date(calc_date);
            return "" + calc_date.getFullYear() + my.zeroFiller(2, calc_date.getMonth() + 1) + my.zeroFiller(2, calc_date.getDate());
        } else {
            return calc_date;
        }
    }

    /**
     * 
     * yyyyMMdd형식의 날짜 값을 받고, 숫자를 받아서 숫자만큼 일을 더해서 계산해주는 메소드.
     * 
     * @method addDay
     * @param {String | Number} date yyyyMMdd 형식의 날짜 테이터.
     * @param {Number} num 더하고싶은 만큼의 일단위 숫자.
     * @param {Number} type type에 dateType가 들어오면 yyyyMMdd의 값을 리턴, <br>
     *                      아니라면 long date 타입으로 리턴
     * @returns {String} date 값에서 num만큼 더한 yyyyMMdd의 값을 리턴.
     * 
     */
    // 지정한 수만큼 +한 일 계산 (YYYYMMDD형식의 날짜가 들어와야함.)
    my.addDay = function(Date, num, type) {
        var calc_date;
        if (String(date).length === 13) {
            calc_date = new Date(date).getTime() + (num * 86400000);
        } else {
            calc_date = new Date(my.dateFormat(date)).getTime() + (num * 86400000);
        }

        if (type === "dateType") {
            calc_date = new Date(calc_date);
            return "" + calc_date.getFullYear() + my.zeroFiller(2, calc_date.getMonth() + 1) + my.zeroFiller(2, calc_date.getDate());
        } else {
            return calc_date;
        }
    }

    /**
     * 
     * yyyyMMdd형식의 날짜 값을 받으면 그날짜의 요일 을 구해서 리턴<br>
     * yyyyMM형식의 날짜 값을 받으면 그 달의 1일의 요일을 구해서 리턴 하는 메소드.
     * 
     * @method dateName
     * @param {String |
     *            Number} date yyyyMMdd 또는 yyyyMM 형식의 날짜 테이터.
     * @returns {String} 해당하는 날짜의 요일을 숫자 형식으로 리턴<br>
     *          0 = 일요일<br>
     *          1 = 월요일<br>
     *          2 = 화요일<br>
     *          3 = 수요일<br>
     *          4 = 목요일<br>
     *          5 = 금요일<br>
     *          6 = 토요일
     * 
     */
    // 날짜의 요일 구하기
    // YYYYMMDD 형식 = 날짜 요일
    // YYYYMM 형식 = 그달 1일의 요일
    my.dateName = function(date) {
        if (date.length == 6) {
            date += "01";
        }
        date = my.dateFormat(date, "/");

        return new Date(date).getDay();
    }
    
    /**
     * 
     * Long Time 데이터를 받아서 yyyyMMdd 형식으로 변환
     * 
     * @method getDate
     * @param {Long Time} time 날짜로 변환할 Long Time
     * @returns {String} yyyyMMdd 데이터
     * 
     */
    my.getDate = function(time) {
        date = new Date(time);
        return date.getFullYear() + my.zeroFiller(2, date.getMonth() + 1) + my.zeroFiller(2, date.getDate());
    }

    /**
     * 
     * yyyyMM 형식의 날짜를 받으면 그달의 마지막 날짜가 몇일 인지 구해서 리턴함.
     * 
     * @method lastDate
     * @param {String |
     *            Number} date yyyyMM 형식의 날짜 테이터.
     * @returns {String} 해당하는 날짜(dd)를 리턴
     * 
     */
    // 달의 마지막 날짜 구하기
    // lastDate = new Date(new Date(today.getFullYear(), today.getMonth()+1,
    // 1)-86400000).getDate();
    my.lastDate = function(date) {
        var Year = date.substring(0, 4);
        var Month = date.substring(4, 6);

        return new Date(new Date(Year, Month, 1) - 86400000).getDate();
    }

    /**
     * 
     * yyyyMM 형식의 날짜를 받으면 그달의 마지막 날짜가 몇일 인지 구해서 리턴함.
     * 
     * @method dateFormat
     * @param {String | Number} date yyyyMM 형식의 날짜 테이터.
     * @param {String} div 년월일 사이에 들어갈 문자 지정 (기본값 '-').
     * @returns {String} 해당하는 날짜(YYYYMMDD 포메팅)를 리턴
     * 
     */
    // Date() 형식에 맞도록 날짜 변경
    my.dateFormat = function(date, div) {
        div = div || "";
        if (!date) {
            return "";
        } else if (date.length === 6) {
            return date.substring(0, 4) + div + date.substring(4, 6);
        } else {
            return date.substring(0, 4) + div + date.substring(4, 6) + div + date.substring(6, 8);
        }
    }

    /**
     * 
     * 캐시를 위한 공간
     * 
     * @member cache
     * 
     */
    my.cache = {};

    /**
     * 
     * JSON 데이터에서 해당 키에 벨류값 이 맞는 데이터를 검색 하는 메소드.
     * 
     * @method find
     * @param {JSON} data 검색할 JSON Object.
     * @param {String} key 검색할 Key 값.
     * @param {String} value 검색할 Value 값.
     * @returns {JSON} 값이 존재 하면 존재하는 모든 값을의 JSON object를 리턴<br>
     *          값이 없으면 undefined 리턴
     * 
     */
    my.find = function(data, key, value) {
        var i, data_array = [];
        if (Array.isArray(data)) {
            for (i = data.length; i--;) {
                if(Array.isArray(value)) {
                    for(var j = 0; j < value.length; j++) {
                        if (data[i][key] === value[j] || (data[i][key].indexOf(value[j]) > -1)) {
                            data_array.push(data[i]);
                        }
                    }
                }
                else {
                    if (data[i][key] === value || (data[i][key].indexOf(value) > -1)) {
                        data_array.push(data[i]);
                    }
                }
            }
            if (data_array.length === 0) {
                return [];
            } else {
                return data_array;
            }
        }
    };
    
    
    /**
     * 
     * Array(JSON) 데이터에서 지정한 value와 비교 해서 특정 데이터를 삭제하는 메소드
     * 
     * @method find
     * @param {Array} data 검색할 Array Object.
     * @param {String} key 검색할 Key 값.
     * @param {String} value 검색할 Value 값.
     * @returns {JSON} 검색 한후 조건을 제외한 나머지 값을 리턴
     * 
     */
    
    my.deleteObject = function(data, key, value) {
        var i, data_array = [];
        if (Array.isArray(data)) {
            for (i = data.length; i--;) {
                if (!(data[i][key] === value)) {
                    data_array.push(data[i]);
                }
            }
            if (data_array.length === 0) {
                return [];
            } else {
                return data_array;
            }
        }
    };

    /**
     * 
     * 3자리 마다 콤마를 찍는 함수(재화 표시)
     * 
     * @method cashCommaFormat
     * @param {String}
     *            money 쉼표를 찍을 값.
     * @returns {String} 쉼표가 찍힌값.
     * 
     */
    my.cashCommaFormat = function(money) {
        var crash_string = (money) ? money.toString().split("") : [];
        var result = "";
        var count = crash_string.length
        for ( var i = 0; i < count; i++) {
            if (i % 3 === 0 && i != 0) {
                result = "," + result;
            }
            result = crash_string.pop() + result;
        }
        return result;
    }

    /**
     * 
     * yyyyMMdd 형식의 데이터를 받으면 yyyy-MM-dd로 변환 해주는 메소드.
     * 
     * @method setDateFormat
     * @param {String |
     *            Number} date 변환할 yyyyMMdd형식의 데이터.
     * @returns {String} 정상적인 리턴은 yyyy-MM-dd로 리턴됨<br>
     *          값이 없거나 잘못됬으면 "" 빈스트링 리턴
     * 
     */
    // 날짜 표기
    my.setDateFormat = function(date) {
        if (my.deleteSC(date) === "00000000" || !my.deleteSC(date) || date === "") {
            return "";
        } else {
            return date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
        }
    }

    /**
     * 
     * hhmm 형식의 데이터를 받으면 hh:mm로 변환 해주는 메소드.
     * 
     * @method setTimeFormat
     * @param {String |
     *            Number} time 변환할 hhmm형식의 데이터.
     * @returns {String} 정상적인 리턴은 hh:mm로 리턴됨<br>
     *          값이 없거나 잘못됬으면 "" 빈스트링 리턴
     * 
     */
    // 시간 표기
    my.setTimeFormat = function(time) {
        if (!time) {
            return "";
        } else {
            if (time.length === 4) {
                return time.substring(0, 2) + ":" + time.substring(2, 4);
            } else if (time.length === 12) {
                return time.substring(8, 10) + ":" + time.substring(10, 12);
            } else {
                return time;
            }
        }
    }

    /**
     * 
     * yyyyMMddhhmm 형식의 데이터를 받으면 yyyy-MM-dd hh:mm로 변환 해주는 메소드.
     * 
     * @method setDateTimeFormat
     * @param {String |
     *            Number} date 변환할 yyyyMMddhhmm형식의 데이터.
     * @returns {String} 정상적인 리턴은 hh:mm로 리턴됨<br>
     *          값이 없거나 잘못됬으면 "" 빈스트링 리턴
     * 
     */
    my.setDateTimeFormat = function(date) {
        if (date.length === 8) {
            date += "000000";
        }
        if (my.deleteSC(date) === "00000000000000" || !my.deleteSC(date) || date === "") {
            return "";
        } else {
            return date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8) + " " + date.substring(8, 10) + ":" + date.substring(10, 12);
        }
    }

    /**
     * 
     * 날짜정보 yyyy-MM-dd 의 값을 yyyyMMdd의 서버에서 받는 형식으로 변환
     * 
     * @method getDateFormat
     * @param {String |
     *            Number} date 변환할 yyyy-MM-dd형식의 데이터.
     * @returns {String} 정상적인 리턴은 yyyyMMdd로 리턴됨
     * 
     */
    my.getDateFormat = function(date) {
        return my.deleteSC(date);
    };

    /**
     * 
     * 시간정보 hh:mm 의 값을 hhmm00의 서버에서 받는 형식으로 변환
     * 
     * @method getTimeFormat
     * @param {String |
     *            Number} date 변환할 hh:mm형식의 데이터.
     * @returns {String} 정상적인 리턴은 hhmm00로 리턴됨
     * 
     */
    my.getTimeFormat = function(time) {
        var result = my.deleteSC(time) + "00";
        return result.substring(0, 6);
    };

    /**
     * 
     * 받은 문자열에 원하는 숫자만큼 0을 채운다음 리턴하는 메소드 ex ) 값 = 3, 길이 = 2, 결과 = 003
     * 
     * @method zeroFiller
     * @param {Number}
     *            len 반복하고 싶은 0의 개수.
     * @param {String}
     *            str 0을 채울 문자열.
     * @returns {String} 문자열 앞에 0을 채운값을 리턴
     * 
     */
    my.zeroFiller = function(len, str) {
        var i = len - str.toString().length, zero_temp = "";

        for (; i--;) {
            zero_temp += "0";
        }
        return zero_temp + str;
    }

    /**
     * 
     * 특정 문자열 앞에있는 모든 0을 제거하는 메소드.<br>
     * ex) 00000345 => 345
     * 
     * @method deleteFZero
     * @param {String}
     *            string 0을 제거하고 싶은 문자열.
     * @returns {String} 0을 제거 하고 난뒤의 문자열 리턴.
     * 
     */
    my.deleteFZero = function(string) {
        return string.replace(/^0+/g, "");
    }

    /**
     * 
     * 특정 문자열에 있는 - 또는 : 를 모두 제거
     * 
     * @method deleteSC
     * @param {String}
     *            string - 나 : 를 제거하고 싶은 문자열.
     * @returns {String} - 나 :를 제거한 문자열 리턴.
     * 
     */
    my.deleteSC = function(string) {
        if (string) {
            return string.replace(/[-:]/gi, "");
        } else {
            return string;
        }
    }

    /**
     * 
     * 문자열로 변환된 숫자를 숫자 타입으로 변환<br>
     * 단, 문자열에 문자 또는 특수문자가 포함되어 있으면 안됨.
     * 
     * @method Number
     * @param {String}
     *            string 숫자타입으로 변환하고 싶은 문자열.
     * @returns {Number} 숫자 타입으면 변환된 값 리턴<br>
     *          문제가 있으면 문자열 그대로 리턴 됨.
     * 
     */
    my.Number = function(string) {
        var num;
        if (typeof string === "string") {
            num = Number(my.deleteSC(string));
            if (num !== "NaN") {
                return num;
            } else {
                return parseInt(my.deleteSC(string), 10);
            }
        } else if (typeof string === "number") {
            return string;
        }
    }

    /**
     * 
     * 문자 수를 체크 한후 값을 넘으면 false 넘지 않으면 true값을 리턴하는 메소드.<br>
     * textarea 같은 곳에서 최대 문자열을 체크 하는데 사용함.
     * 
     * @method stringLengthCheck
     * @param {String}
     *            string 체크 할 문자열.
     * @param {Number}
     *            cnt 체크 할 문자열 수.
     * @returns {BOOLEAN} 체크 한 수 보다 문자열의 수가 적으면 TRUE 리턴<br>
     *          반대면 FALSE 리턴 함.
     * 
     */
    // 문자 수 체크 true 사용 가능 false 불가
    my.stringLengthCheck = function(string, cnt) {
        var full_text = string.trim(), len = 0, temp_text;
        for ( var i = 0; i < full_text.length; i++) {
            temp_text = full_text.charAt(i);
            if (escape(temp_text).length > 4) {
                len += 2;
            } else {
                len += 1;
            }
        }
        ;

        if (len > cnt) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 
     * 오늘의 날짜를 구하는 메소드.
     * 
     * @method today
     * @param {Number} num 6 이들어 오면 yyyyMM <br>
     *                      14가 들어오면 yyyyMMDDHHmmss 리턴<br>
     *                      다른 값이 들어오면 yyyyMMdd를 얻게됨.
     * @returns {String} 오늘의 날짜는 yyyyMM 또는 yyyyMMdd 값으로 리턴함.
     * 
     */
    // 오늘 날짜 리턴
    my.today = function(num) {
        var date = new Date();
        if (num === 6) {
            return date.getFullYear() + my.zeroFiller(2, date.getMonth() + 1);
        } else if ( num === 14 ) {
            return date.getFullYear() + my.zeroFiller(2, date.getMonth() + 1) + my.zeroFiller(2, date.getDate()) + my.zeroFiller(2, date.getHours()) + my.zeroFiller(2, date.getMinutes()) + my.zeroFiller(2, date.getSeconds());
        } else {
            return date.getFullYear() + my.zeroFiller(2, date.getMonth() + 1) + my.zeroFiller(2, date.getDate());
        }
    }

    /**
     * 
     * 오늘의 날짜 시간을 구하는 메소드.
     * 
     * @method toDateTime
     * @returns {String} 현재의 yyyyMMddhhmmss 값을 리턴함.
     * 
     */
    // 오늘 날짜 시간 리턴
    my.toDateTime = function() {
        var date = new Date();
        return date.getFullYear() + my.zeroFiller(2, date.getMonth() + 1) + my.zeroFiller(2, date.getDate()) + my.zeroFiller(2, date.getHours()) + my.zeroFiller(2, date.getMinutes()) + my.zeroFiller(2, date.getSeconds());
    }

    return my;
})();
