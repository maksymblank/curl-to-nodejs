import shellwords from 'shellwords';
import * as _ from 'lodash';
import qs from 'querystring';
import beauty from 'js-beautify';

const decodeCURL = curl => {
    if (curl.indexOf('curl ') !== 0) {
        throw Error('cURL request has to start with curl');
    }

    curl = _.replace(curl, /\r\n/g, '');
    curl = _.replace(curl, /\\/g, '');

    const out = {
        method: 'GET',
        header: {}
    };
    let state;

    _.each(shellwords.split(curl), arg => {
        if(!!state){
            switch(state){
                case 'user-agent':
                    out.header['User-Agent'] = arg
                    state = ''
                    break;
                
                case 'cookie':
                    out.header['Set-Cookie'] = arg
                    state = ''
                    break;

                case 'data':
                    if (out.method === 'GET' || out.method === 'HEAD') out.method = 'POST'
                    out.header['Content-Type'] = out.header['Content-Type'] || 'application/x-www-form-urlencoded'
                    out.body = out.body ? out.body + '&' + arg : arg

                    state = ''
                    break;

                case 'header':
                    const [header, value] = arg.split(/: (.+)/)
                    out.header[header] = value
                    state = ''
                    break;

                case 'user':
                    out.header['Authorization'] = `Basic ${btoa(arg)}`;
                    state = ''
                    break;

                case 'method':
                    out.method = arg;
                    state = '';
                    break;

                case 'url':
                    const [url, query] = _.split(arg, '?');
                    out.url = url;
                    out.qs = qs.parse(query);
                    state = '';
                    break;

                default: {
                    console.log('Unknown state.', state);
                }
            }
        } else if(_.startsWith(arg, '-')){
            switch(arg){
                case '-A':
                case '--user-agent':
                    state = 'user-agent';
                    break;

                case '-b':
                case '--cookie':
                    state = 'cookie';
                    break;

                case '--compressed':
                    out.header['Accept-Encoding'] = out.header['Accept-Encoding'] || 'deflate, gzip';
                    break;

                case '-d':
                case '--data':
                case '--data-ascii':
                case '--data-binary':
                    state = 'data';
                    break;

                case '-H':
                case '--header':
                    state = 'header';
                    break;

                case '-u':
                case '--user':
                    state = 'user';
                    break;

                case '-I':
                case '--head':
                    out.method = 'HEAD';

                case '-X':
                case '--request':
                    state = 'method';
                    break;

                case '--url':
                    state = 'url';
                    break;

                default: {
                    // Unknown arg

                    state = '';
                }
            }
        } else if(/^https?:\/\//.test(arg)) {
            const [url, query] = _.split(arg, '?');
            out.url = url;
            out.qs = qs.parse(query);
        }
    })

    return out;
}

const objToString = (name, obj) => {
    if(!_.keys(obj).length){
        return '';
    }

    return `${!!name ? `${name}: ` : ''}{${_.map(obj, (v, k) => `"${k}": "${v}"`)}}${!!name ? ',' : ''}`;
}

const convertTo = (data, type) => {
    switch(type){
        case 'axios': {
            return `
                const axios = require('axios');

                axios({
                    method: '${data.method}',
                    url: '${data.url}',
                    ${objToString('headers', data.header)}${objToString('params', data.qs)}${data.body ? `data: ${data.body}` : ''}
                }).then((res) => {
                    console.log(res.data); // Response body
                }).catch(e => {
                    console.error(e);
                })
            `
        }
        case 'request': {
            return `
                const request = require('request');

                request({
                    method: '${data.method}',
                    url: '${data.url}${_.keys(data.qs).length ? `?${qs.stringify(data.qs)}` : ''}',${objToString('headers', data.header)}${data.body ? `form: ${data.body}` : ''}
                }, (err, res, body) => {
                    if(err){
                        console.error(e);
                        return;
                    }

                    console.log(body); // Response body
                })
            `;
        }
        case 'request-promise': {
            return `
                const request = require('request-promise');

                request({
                    method: '${data.method}',
                    url: '${data.url}${_.keys(data.qs).length ? `?${qs.stringify(data.qs)}` : ''}',${objToString('headers', data.header)}${data.body ? `form: ${data.body}` : ''}
                }).then((body) => {
                    console.log(body); // Response body
                }).catch(e => {
                    console.error(e);
                })
            `;
        }
        case 'superagent': {
            return `
                const superagent = require('superagent');

                superagent
                    .${_.toLower(data.method)}('${data.url}')
                    ${_.keys(data.qs).length ? `.query(${objToString('', data.qs)})` : ''}
                    ${_.keys(data.header).length ? `.set(${objToString('', data.header)})` : ''}
                    ${data.body ? `.send(${data.body})` : ''}
                    .then((res) => {
                        console.log(res.body); // Response body
                    }).catch(e => {
                        console.error(e);
                    });
            `;
        }

        case 'fetch': {
            return `
                const fetch = require('node-fetch');

                fetch('${data.url}${_.keys(data.qs).length ? `?${qs.stringify(data.qs)}` : ''}', {
                    "method": "${data.method}",${objToString('headers', data.header)}${data.body ? `body: ${data.body}` : ''}
                }).then(res => {
                    console.log(res.json()); // Response body
                }).catch(e => {
                    console.error(e);
                });
            `
        }

        default: {
            return '';
        }
    }
}

export default (curl, type) => {
    const decoded = decodeCURL(curl);

    return beauty(convertTo(decoded, type));
}