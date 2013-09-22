/*  Test 5.8.2 Error Test 6; prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        Write to a valid attributes (DisplayName, Value) of multiple 
        unknown nodes, in a single call.

    Revision History
        29-Sep-2009 NP: Initial version.
        16-Nov-2009 NP: REVIEWED.

     FOR MORE INFORMATION ABOUT THIS AND OTHER TEST CASES, PLEASE REVIEW:
         Test Lab Specifications Part 8 - UA Server Section 5.8.2.
*/

function write582Err010()
{
    // define the nodeIds we're going to read from the settings
    var unknownNodeNames = [
        "/Advanced/NodeIds/Invalid/UnknownNodeId1",
        "/Advanced/NodeIds/Invalid/UnknownNodeId2",
        "/Advanced/NodeIds/Invalid/UnknownNodeId3",
        "/Advanced/NodeIds/Invalid/UnknownNodeId4",
        ];

    // build the write header objects
    var writeReq = new UaWriteRequest()
    var writeRes = new UaWriteResponse()
    g_session.buildRequestHeader( writeReq.RequestHeader )

    // prepare our expected error array
    var errorsExpected = new Array();
    var currentNodeNumber = 0;



    // --------------< UNKNOWN SYNTAX NODE >---------------------
    for( var i=0; i<unknownNodeNames.length; i++ )
    {
        //write to the Value, as int 16
        writeReq.NodesToWrite[currentNodeNumber].NodeId = UaNodeId.fromString( readSetting( unknownNodeNames[i] ).toString() );
        writeReq.NodesToWrite[currentNodeNumber].AttributeId = Attribute.Value;
        writeReq.NodesToWrite[currentNodeNumber].Value.Value = new UaVariant();
        writeReq.NodesToWrite[currentNodeNumber].Value.Value.setInt16( 100 );

        // prepare our expected error
        errorsExpected[currentNodeNumber] = new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid );
        errorsExpected[currentNodeNumber].addExpectedResult( StatusCode.BadNodeIdUnknown );

        // write to the DisplayName
        writeReq.NodesToWrite[++currentNodeNumber].NodeId = UaNodeId.fromString( readSetting( unknownNodeNames[i] ).toString() );
        writeReq.NodesToWrite[currentNodeNumber].AttributeId = Attribute.DisplayName;
        writeReq.NodesToWrite[currentNodeNumber].Value.Value = new UaVariant();
        writeReq.NodesToWrite[currentNodeNumber].Value.Value.setString( "display #1" );

        // prepare our expected error
        errorsExpected[currentNodeNumber] = new ExpectedAndAcceptedResults( StatusCode.BadNodeIdInvalid );
        errorsExpected[currentNodeNumber].addExpectedResult( StatusCode.BadNodeIdUnknown );
    }


    var uaStatus = g_session.write( writeReq, writeRes );
    if( uaStatus.isGood() )
    {
        // this is an array of ExpectedAndAcceptedResult. Size of the array = number of nodes to read
        checkWriteError( writeReq, writeRes, errorsExpected, false, unknownNodeNames, OPTIONAL_CONFORMANCEUNIT );
    }
    else
    {
        addError( "Write(): status " + uaStatus, uaStatus );
    }
}

safelyInvoke( write582Err010 );