import { useState } from "react"
import decodeCURL from '../src/services/curl';
import { RadioGroup, FormControlLabel, Radio, Button } from "@material-ui/core";
import FileCopy from '@material-ui/icons/FileCopy';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import _ from 'lodash';
import copy from 'copy-to-clipboard';

export default function Home(){
  const [curl, setCurl] = useState('');
  const [lib, setLib] = useState('axios');
  const [decoded, setDecoded] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = _lib => {
    try{
      if(!!error) setError('');

      const decoded = decodeCURL(curl, _lib || lib);

      if(!decoded){
        return '';
      }

      setDecoded(decoded);
    }catch({message}){
      setError(message);
    }
  }

  const handleCopy = () => {
    copy(decoded);
    setCopied(true);

    setTimeout(() => {
      setCopied && setCopied(false);
    }, 2000)
  }

  const libs = [
    {
      id: 'axios',
      label: 'Axios'
    },
    {
      id: 'request',
      label: 'Request'
    },
    {
      id: 'request-promise',
      label: 'Request Promise'
    },
    {
      id: 'fetch',
      label: 'Fetch'
    },
    {
      id: 'superagent',
      label: 'SuperAgent'
    },
  ]

  return (
    <main>
      <div className={'container mx-auto py-16'} style={{minHeight: 'calc(100vh - 5rem)'}}>
        <h1 className={'text-center text-4xl font-bold'}>cURL to NodeJS (Axios, Request, SuperAgent, Fetch)</h1>

        <h2 className={'text-center text-2xl font-semibold text-gray-700 mt-6 mb-4'}>1. Paste your cURL request</h2>

        <textarea autoCapitalize={'none'} autoCorrect={'off'} className={'text-2xl h-64 resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'} value={curl} onChange={({target: {value}}) => setCurl(value)} placeholder="Enter your curl.."></textarea>

        {
          !!error && (
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
              <strong class="font-bold mr-2">Oopsies!</strong>
              <span class="block sm:inline">{error}.</span>
              
              <div className="absolute top-0 bottom-0 right-0 flex justify-center align-center">
                <Button
                  onClick={() => setError('')}
                  color={'secondary'}>
                  <Close />
                </Button>
              </div>
            </div>
          )
        }

        <h2 className={'text-center text-2xl font-semibold text-gray-700 mb-4 mt-6'}>2. Pick nodeJS library</h2>

        <div className={'flex align-center justify-center'}>
          <RadioGroup row name="lib" value={lib} onChange={({target: {value}}) => {setLib(value); handleConvert(value)}}>
            {
              _.map(libs, v => (
                <FormControlLabel
                  key={v.id}
                  value={v.id}
                  control={<Radio />}
                  label={v.label}
                  labelPlacement={'bottom'}
                  />
              ))
            }
          </RadioGroup>
        </div>

        <div className="flex align-center justify-center mt-12">
          <Button style={{paddingLeft: 36, paddingRight: 36, fontSize: 24}} variant={'contained'} color={'primary'} onClick={() => handleConvert()}>Convert</Button>
        </div>

        {
          !!decoded && (
            <div className="relative">
              <pre readOnly className={'mt-8 overflow-scroll shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}>{decoded}</pre>
              <div className="absolute top-0 right-0">
                <Button
                  onClick={handleCopy}
                  color={'primary'}>
                  {
                    copied ? <Check /> : <FileCopy />
                  }
                </Button>
              </div>
            </div>
          )
        }
      </div>
      <div className={'h-20 flex justify-center align-center flex-col'}>
        <p className="text-center text-gray-900 mb-1">Created with ❤️ by <a href="https://github.com/maksymblank">Maksym Blank</a></p>
        <p className="text-center text-gray-700">I'm bored in the house and I'm in the house bored <a href="http://google.com/search?q=coronavirus">#coronavirus</a></p>
      </div>
    </main>
  )
}