<x-message-banner msg="HEHEHEH"/>
<h1>I AM USER {{$name}}</h1>

<h1>{{rand()}}</h1>

<h1>{{$array[1]}}</h1>

@if ($name == 'sam')
    <h2>HELLO I AM SAM</h2>
@endif
@foreach ($array as $arr)    
    <h1>{{$arr}}</h1>
@endforeach

@for ($i=0;$i<=20;$i++)
    {{$i}}
@endfor