# proxy-lab

## recitation

>
>
>client和server中间可以加一层proxy
>proxy作用不仅仅是接收client的req，传递给server；
>接收server的res，传递给client；
>
>more important
>proxy可以通过cache，可以将一些response进行缓存
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531194500.png" alt="image-20210531194452907" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531194514.png" alt="image-20210531194514788" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531194755.png" alt="image-20210531194755703" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531194806.png" alt="image-20210531194806454" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531195006.png" alt="image-20210531195006531" style="zoom:80%;" />
>
>在linux下测试，int a=1234，对应十六进制4d2
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531200140.png" alt="image-20210531200140452" style="zoom:80%;" />
>
>说明linux是little endian byte order
>
>>https://chortle.ccsu.edu/assemblytutorial/Chapter-15/ass15_3.html
>>
>>> **Big Endian Byte Order:** The **most significant** byte (the "big end") of the data is placed at the byte with the lowest address. The rest of the data is placed in order in the next three bytes in memory.
>>>
>>> **Little Endian Byte Order:** The **least significant** byte (the "little end") of the data is placed at the byte with the lowest address. The rest of the data is placed in order in the next three bytes in memory.
>>
>>In these definitions, the data, a 32-bit pattern, is regarded as a 32-bit unsigned integer. The "most significant" byte is the one for the largest powers of two: 231, ..., 224. The "least significant" byte is the one for the smallest powers of two: 27, ..., 20.
>>
>>For example, say that the 32-bit pattern 0x12345678 is stored at address 0x00400000. **The most significant byte is 0x12; the least significant is 0x78.**
>>
>>Within a **byte** the order of the bits is the same for all computers (no matter how the bytes themselves are arranged).
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531203852.png" alt="image-20210531203852221" style="zoom: 67%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531203928.png" alt="image-20210531203928554" style="zoom:100%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204008.png" alt="image-20210531204008543" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204021.png" alt="image-20210531204021328" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204406.png" alt="image-20210531204406157" style="zoom:100%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204415.png" alt="image-20210531204415196"  />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204452.png" alt="image-20210531204452641" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204505.png" alt="image-20210531204504954" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204513.png" alt="image-20210531204513448" style="zoom:80%;" />
>
>——————
>
><img src="https://yszhou.oss-cn-beijing.aliyuncs.com/img/20210531204544.png" alt="image-20210531204544245" style="zoom:80%;" />



## lab-notes



