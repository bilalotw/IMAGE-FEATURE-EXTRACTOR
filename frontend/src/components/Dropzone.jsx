import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiCopy } from "react-icons/fi"
import get_data_url from "../function/get_data_url"

export default function Dropzone({ setFiles }) {

    const onDrop = useCallback(async acceptedFiles => {
        var af = [], i
        for (i = 0; i < acceptedFiles.length; i++) {
            af[i] = await get_data_url(acceptedFiles[i])
        }
        setFiles(af)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.bmp']
        },
        multiple: true
    })

    return (
        <div className='w-full h-full' {...getRootProps()}>
            <input {...getInputProps()} />
            <div className='w-full h-full flex items-center justify-center cursor-pointer'>
                <span className='text-5xl text-gray-600'><FiCopy /></span>
                <span className='ml-2 text-gray-600'>
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag and drop some files here, or click to select files</p>
                    }
                </span>
            </div>
        </div>
    )
}